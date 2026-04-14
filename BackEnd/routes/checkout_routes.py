from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Checkout_Summary, Checkout, Order_T, Products

checkout_bp = Blueprint('checkout_bp', __name__, url_prefix='/checkout')


# ---------------- Create Checkout (POST) ---------------- #
@checkout_bp.route('/create', methods=['POST'])
@checkout_bp.route('/', methods=['POST'])
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    orders = data.get("orders", [])
    if not orders:
        return jsonify({'status': 'error', 'message': 'Cart is empty'}), 400
    
    total = sum(item.get('price', 0) * item.get('quantity', 0) for item in orders)
    summary = Checkout_Summary(user_id=user_id, total_amount=total)
    db.session.add(summary)
    db.session.flush()  # So summary.id becomes available

    for item in orders:
        product_id = item.get('product_id')
        if not product_id:
            product = Products.query.filter_by(
                product_name=item.get('name') or item.get('product_name'),
                product_price=item.get('price'),
                product_category=item.get('category')
            ).first()
            if product:
                product_id = product.product_id
            else:
                return jsonify({
                    'status': 'error',
                    'message': f"Unable to resolve product for '{item.get('name') or item.get('product_name')}'"
                }), 400

        checkout = Checkout(
            checkout_id=summary.id,
            product_id=product_id,
            product_name=item.get('name') or item.get('product_name'),
            unit_price=item.get('price'),
            quantity=item.get('quantity'),
            subtotal=(item.get('price') or 0) * (item.get('quantity') or 0)
        )
        db.session.add(checkout)

    db.session.commit()

    # Clear the user's cart from Order_T
    Order_T.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Checkout completed successfully'}), 201


# ---------------- Get All Orders (Admin) or User Orders ---------------- #
@checkout_bp.route('/', methods=['GET'])
@jwt_required()
def get_checkouts():
    user_id = int(get_jwt_identity())
    location = request.args.get('location')  # 'cart' or None
    
    # Determine if user is admin (assuming admin has user_id == 1)
    if user_id == 1:  # Admin sees all orders
        summaries = Checkout_Summary.query.order_by(Checkout_Summary.created_at.desc()).all()
    else:  # Regular users see only their orders
        summaries = Checkout_Summary.query.filter_by(user_id=user_id).order_by(Checkout_Summary.created_at.desc()).all()
    
    # Get items for each summary
    checkout_list = []
    for summary in summaries:
        summary_dict = summary.toCheckout_dict()
        items = Checkout.query.filter_by(checkout_id=summary.id).all()
        summary_dict['items'] = [item.to_dict() for item in items]
        checkout_list.append(summary_dict)
    
    return jsonify({'checkout_list': checkout_list}), 200


# ---------------- Update Order Status ---------------- #
@checkout_bp.route('/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    user_id = int(get_jwt_identity())
    
    # Only admin can update status
    if user_id != 1:
        return jsonify({'status': 'Unauthorized: Admin access required'}), 401
    
    data = request.get_json()
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({'status': 'error', 'message': 'Status is required'}), 400
    
    # Validate status
    valid_statuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'status': 'error', 'message': 'Invalid status'}), 400
    
    order = Checkout_Summary.query.get(order_id)
    if not order:
        return jsonify({'status': 'error', 'message': 'Order not found'}), 404
    
    order.status = new_status
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': 'Order status updated'}), 200


# ---------------- Delete Order ---------------- #
@checkout_bp.route('/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    user_id = int(get_jwt_identity())
    
    # Only admin can delete
    if user_id != 1:
        return jsonify({'status': 'Unauthorized: Admin access required'}), 401
    
    order = Checkout_Summary.query.get(order_id)
    if not order:
        return jsonify({'status': 'error', 'message': 'Order not found'}), 404
    
    # Delete associated checkout items first
    Checkout.query.filter_by(checkout_id=order_id).delete()
    db.session.delete(order)
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': 'Order deleted'}), 200


# ---------------- Get Single Checkout ---------------- #
@checkout_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_checkout(order_id):
    user_id = int(get_jwt_identity())
    order = Checkout_Summary.query.get(order_id)
    if not order:
        return jsonify({'status': 'error', 'message': 'Order not found'}), 404

    if user_id != 1 and order.user_id != user_id:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    order_dict = order.toCheckout_dict()
    items = Checkout.query.filter_by(checkout_id=order.id).all()
    order_dict['items'] = [item.to_dict() for item in items]

    return jsonify({'status': 'success', 'order': order_dict}), 200


# ---------------- History Summary ---------------- #
@checkout_bp.route('/history', methods=['GET'])
@jwt_required()
def checkout_history():
    user_id = int(get_jwt_identity())
    history = Checkout_Summary.query.filter_by(user_id=user_id).order_by(Checkout_Summary.created_at.desc()).all()

    return jsonify({
        "status": "success",
        "history": [h.toCheckout_dict() for h in history]
    }), 200


# ---------------- History Details ---------------- #
@checkout_bp.route('/details/<int:id>', methods=['GET'])
@jwt_required()
def checkout_details(id):
    user_id = int(get_jwt_identity())
    order = Checkout_Summary.query.get(id)
    
    if not order:
        return jsonify({'status': 'error', 'message': 'Order not found'}), 404
    
    # Non-admin users can only view their own orders
    if user_id != 1 and order.user_id != user_id:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403
    
    order_dict = order.toCheckout_dict()
    items = Checkout.query.filter_by(checkout_id=order.id).all()
    
    if not items:
        return jsonify({'status': 'error', 'message': 'No items found'}), 404
    
    order_dict['items'] = [item.to_dict() for item in items]
    
    return jsonify({
        "status": "success",
        "order": order_dict
    }), 200
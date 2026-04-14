from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Order_T, Products

order_bp = Blueprint('order_bp', __name__, url_prefix='/order')


@order_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_order():
    user_id = int(get_jwt_identity())
    data = request.json
    product_id = data.get('id')
    quantity = data.get('quantity', 1)

    product = Products.query.get(product_id)
    print(data)
    if not product:
        return jsonify({'status': 'Product not found'}), 404

    order_item = Order_T(
        user_id=user_id,
        name=product.product_name,
        price=product.product_price,
        quantity=quantity,
        category=product.product_category
    )

    db.session.add(order_item)
    db.session.commit()
    return jsonify({'status': 'Item added to cart'}), 201


@order_bp.route('/fetch', methods=['GET'])
@jwt_required()
def fetch_orders():
    user_id = int(get_jwt_identity())
    orders = Order_T.query.filter_by(user_id=user_id).all()
    
    return jsonify([order.to_dict() for order in orders]), 200


@order_bp.route('/delete/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_order_item(item_id):
    user_id = int(get_jwt_identity())
    item = Order_T.query.get(item_id)
    if not item:
        return jsonify({'status': 'Item not found'}), 404
    if item.user_id != user_id:
        return jsonify({'status': 'Unauthorized'}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({'status': 'Item removed from cart'}), 200


@order_bp.route('/update/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_quantity(item_id):
    user_id = int(get_jwt_identity())
    data = request.json
    new_qty = data.get('quantity')
    if new_qty is None or new_qty < 1:
        return jsonify({'status': 'Invalid quantity'}), 400

    order_item = Order_T.query.get(item_id)
    if not order_item:
        return jsonify({'status': 'Item not found'}), 404
    if order_item.user_id != user_id:
        return jsonify({'status': 'Unauthorized'}), 403
    order_item.quantity = new_qty
    db.session.commit()
    return jsonify({'status': 'Quantity updated successfully'}), 200

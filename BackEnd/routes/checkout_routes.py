from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Checkout_Summary, Checkout, Order_T

checkout_bp = Blueprint('checkout_bp', __name__, url_prefix='/checkout')


@checkout_bp.route('/', methods=['POST'])
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())
    orders = Order_T.query.filter_by(user_id=user_id).all()

    if not orders:
        return jsonify({'status': 'Cart is empty'}), 400

    total = sum(item.price * item.quantity for item in orders)
    summary = Checkout_Summary(user_id=user_id, total_amount=total)
    db.session.add(summary)
    db.session.flush()

    for order in orders:
        item = Checkout(
            checkout_id=summary.id,
            product_id=None,
            product_name=order.name,
            unit_price=order.price,
            quantity=order.quantity,
            subtotal=order.price * order.quantity
        )
        db.session.add(item)

    db.session.commit()

    # clear cart after checkout
    for order in orders:
        db.session.delete(order)
    db.session.commit()

    return jsonify({'status': 'Checkout completed successfully'}), 201


@checkout_bp.route('/history', methods=['GET'])
@jwt_required()
def checkout_history():
    user_id = int(get_jwt_identity())
    history = Checkout_Summary.query.filter_by(user_id=user_id).all()
    return jsonify([h.toCheckout_dict() for h in history]), 200


@checkout_bp.route('/details/<int:cid>', methods=['GET'])
@jwt_required()
def checkout_details(cid):
    items = Checkout.query.filter_by(checkout_id=cid).all()
    if not items:
        return jsonify({'status': 'No items found'}), 404
    return jsonify([item.to_dict() for item in items]), 200

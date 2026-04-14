from flask import Flask, jsonify, send_from_directory, Blueprint, request, current_app
from flask_cors import CORS
from datetime import timedelta
import os
from werkzeug.utils import secure_filename

from config import Config
from extensions import db, bcrypt, jwt
from models import Products, Order_T, Checkout, Checkout_Summary, User
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.checkout_routes import checkout_bp

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Create upload folder if not exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Ensure any defined models are created when the app starts
    with app.app_context():
        db.create_all()

    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
    )

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(checkout_bp)

    compat_bp = Blueprint('compat_bp', __name__)

    @compat_bp.route('/addProduct', methods=['POST'])
    @jwt_required()
    def add_product_root():
        user_id = int(get_jwt_identity())
        if user_id != 1:
            return jsonify({'status': 'Unauthorized access'}), 401

        name = request.form.get('name')
        price = request.form.get('price')
        category = request.form.get('category')
        file = request.files.get('file')

        if not all([name, price, category, file]):
            return jsonify({'status': 'Input field missing!'}), 400

        try:
            price_int = int(price)
        except (ValueError, TypeError):
            return jsonify({'status': 'Price must be a valid number!'}), 400

        if not allowed_file(file.filename):
            return jsonify({'status': 'Invalid file type or no file uploaded!'}), 400

        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

        new_product = Products(
            product_name=name,
            file_name=filename,
            product_price=price_int,
            product_category=category,
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({'status': 'product added successfully'}), 200

    @compat_bp.route('/changeProduct/<int:id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def change_product_root(id):
        user_id = int(get_jwt_identity())
        if user_id != 1:
            return jsonify({'status': 'Unauthorized. Only admin can perform this action.'}), 403

        product = Products.query.get(id)
        if not product:
            return jsonify({'status': 'Product not found!'}), 404

        if request.method == 'DELETE':
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], product.file_name)
            if os.path.exists(file_path):
                os.remove(file_path)
            db.session.delete(product)
            db.session.commit()
            return jsonify({'status': 'Product Deleted'}), 200

        name = request.form.get('name')
        price = request.form.get('price')
        category = request.form.get('category')
        file = request.files.get('file')

        if name:
            product.product_name = name
        if price:
            try:
                product.product_price = int(price)
            except (ValueError, TypeError):
                return jsonify({'status': 'Price must be a valid number!'}), 400
        if category:
            product.product_category = category
        if file:
            if not allowed_file(file.filename):
                return jsonify({'status': 'Invalid file type'}), 400
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], product.file_name)
            if os.path.exists(old_path):
                os.remove(old_path)
            product.file_name = filename

        db.session.commit()
        return jsonify({'status': 'Product Updated!'}), 200

    @compat_bp.route('/showProducts', methods=['GET'])
    def show_products_root():
        category = request.args.get('category')
        if category and category.lower() != 'no filter':
            products = Products.query.filter_by(product_category=category).all()
        else:
            products = Products.query.all()

        orders = Order_T.query.all()
        if not products:
            return jsonify({'status': 'No product available'}), 404

        return jsonify({
            'status': 'Products available',
            'products': [product.to_products() for product in products],
            'orders': [order.to_dict() for order in orders]
        })

    @compat_bp.route('/order', methods=['POST', 'PUT'])
    @jwt_required()
    def order_root():
        data = request.json
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'status': 'user not found'}), 404

        if request.method == 'POST':
            name = data.get('name')
            quantity = data.get('quantity', 1)
            price = data.get('price')
            category = data.get('category')

            if not all([name, price, category]):
                return jsonify({'status': 'Missing fields!'}), 400

            try:
                price_int = int(price)
            except (ValueError, TypeError):
                return jsonify({'status': 'Price must be a valid number!'}), 400

            new_order = Order_T(
                name=name,
                quantity=quantity,
                price=price_int,
                category=category,
                user_id=user_id,
            )
            db.session.add(new_order)
            db.session.commit()
            orders = Order_T.query.filter_by(user_id=user_id).all()
            return jsonify({
                'status': 'Added to Cart',
                'orders': [order.to_dict() for order in orders]
            }), 200

        name = data.get('name')
        if not name:
            return jsonify({'status': 'Name is required for update!'}), 400

        order = Order_T.query.filter_by(name=name, user_id=user_id).first()
        if not order:
            return jsonify({'status': 'Item not found!'}), 404

        order.quantity += data.get('quantity', 1)
        db.session.commit()
        orders = Order_T.query.filter_by(user_id=user_id).all()
        return jsonify({
            'status': 'product added',
            'orders': [o.to_dict() for o in orders]
        }), 201

    @compat_bp.route('/fetchOrders', methods=['GET'])
    @jwt_required()
    def fetch_orders_root():
        user_id = int(get_jwt_identity())
        orders = Order_T.query.filter_by(user_id=user_id).all()
        if not orders:
            return jsonify({'status': 'Cart Empty'}), 200
        return jsonify({
            'status': 'success',
            'orders': [order.to_dict() for order in orders]
        }), 200

    @compat_bp.route('/deleteItem', methods=['DELETE'])
    @jwt_required()
    def delete_item_root():
        data = request.json
        item_id = data.get('id')
        if not item_id:
            return jsonify({'status': 'No product found'}), 400

        item = Order_T.query.filter_by(order_id=item_id).first()
        if not item:
            return jsonify({'status': 'Item not found'}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({'status': 'success', 'message': f'Item {item_id} deleted successfully'}), 200

    @compat_bp.route('/updateQuantity', methods=['POST'])
    @jwt_required()
    def update_quantity_root():
        data = request.json
        item_id = data.get('id')
        new_quantity = data.get('quantity')
        if not item_id or new_quantity is None:
            return jsonify({'status': 'Missing required fields'}), 400
        if new_quantity < 1:
            return jsonify({'status': 'Quantity must be at least 1'}), 400

        item = Order_T.query.filter_by(order_id=item_id).first()
        if not item:
            return jsonify({'status': 'Item not found'}), 404

        item.quantity = new_quantity
        db.session.commit()
        return jsonify({
            'status': 'success',
            'message': 'Quantity updated successfully',
            'item': item.to_dict()
        }), 200

    app.register_blueprint(compat_bp)

    #  Serve uploaded images
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        upload_folder = app.config['UPLOAD_FOLDER']
        return send_from_directory(upload_folder, filename)

    # Test route
    @app.route('/')
    def home():
        return jsonify({"msg": "Connection Established"})

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)

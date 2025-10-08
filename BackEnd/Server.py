# ===============================================================================================

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import timedelta 

# file/image handling
from werkzeug.utils import secure_filename
import os
# 
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/flask_ecommerce'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = "super_secret_jwt_key"  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5) 
# ===========
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
# ==========
CORS(app, resources={r"/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Authorization"])

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --------------------------- MODELS ------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(300))

    orders = db.relationship('Order_T', backref='user', lazy=True)
    checkouts = db.relationship('Checkout_Summary', backref='user', lazy=True)


class Products(db.Model):
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(50), nullable=False)
    file_name = db.Column(db.String(250), nullable=False)
    product_price = db.Column(db.Integer, nullable=False)
    product_category = db.Column(db.String(50), nullable=False)

    def to_products(self):
        return {
            "product_id": self.product_id,
            "product_name": self.product_name,
            "file_name": self.file_name,
            "product_price": self.product_price,
            "product_category": self.product_category
        }


class Order_T(db.Model):
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "item_id": self.order_id,
            "user_id": self.user_id,
            "name": self.name,
            "quantity": self.quantity,
            "price": self.price,
            "category": self.category
        }

# --------------------------- MODELS ------------------------


class Checkout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    checkout_id = db.Column(db.Integer, db.ForeignKey('checkout_summary.id'), nullable=False) 

    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    product_name = db.Column(db.String(50), nullable=False)

    unit_price = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, default=1)
    subtotal = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'checkout_id': self.checkout_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'unit_price': self.unit_price,
            'quantity': self.quantity,
            'subtotal': self.subtotal
        }

    

class Checkout_Summary(db.Model):
    __tablename__ = 'checkout_summary' 

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(20), default="pending", nullable=False)
    
    items = db.relationship('Checkout', backref='summary', lazy=True)

    def toCheckout_dict(self):
        return {
        'id' : self.id,
        'user_id' : self.user_id,
        'total_amount' : self.total_amount,
        'created_at' : self.created_at,
        'status' : self.status}


@app.route('/')
def Connection():
    return jsonify({"msg": "Connection Established"})


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    print(name, email, password)
    if not all([name, email, password]):
        return jsonify({'status': 'Input field missing!'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'User already exist! Please provide different email'}), 409
    
    passwordHash = bcrypt.generate_password_hash(password).decode('utf-8')

    newUser = User(name=name, email=email, password=passwordHash)
    db.session.add(newUser)
    db.session.commit()

    return jsonify({"status": "User added successfully!", " Name": name, " Email": email}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({"status": "Missing input field"}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"status": "Invalid email or password"}), 401

    role = "admin" if user.email == 'uzair@gmail.com' else "customer"

    accessToken = create_access_token(
    identity=str(user.id),  # sub must be string
    additional_claims={"email": user.email, "role": role}

    # identity={"id":str(user.id), "email":user.email, "role":role} //  lead to error 422 "sub must be string" because it expects string not the dictionary
)
    return jsonify({"accessToken": accessToken}), 200
# ===================
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS
# =====================
# In your server.py, inside the addNewProduct function

@app.route('/addProduct', methods=['POST'])
@jwt_required()
def addNewProduct():
    user_id = int(get_jwt_identity())
    if(user_id != 1):
        return jsonify({"status": "Unauthorized access"}), 401

    name = request.form.get('name')
    price = request.form.get('price')
    category = request.form.get('category')
    file = request.files.get('file')

    # FIX: Add better validation for file and other fields
    if not all([name, price, category, file]):
        return jsonify({"status": "Input field missing!"}), 400
    
    # FIX: Ensure price is an integer to match the database model
    try:
        price_int = int(price)
    except (ValueError, TypeError):
        return jsonify({"status": "Price must be a valid number!"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # FIX: The KeyError was here; app.config['UPLOAD_FOLDER'] is the correct way
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename)) 
    else:
        return jsonify({"status": "Invalid file type or no file uploaded!"}), 400
    
    newProduct = Products(product_name=name, file_name=filename, product_price=price_int, product_category=category)
    db.session.add(newProduct)
    db.session.commit()

    return jsonify({"status": "product added successfully"}), 200

@app.route('/changeProduct/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def modify(id):
    user_id = int(get_jwt_identity())  # The current logged-in user

    # Check if user is admin (id == 1)
    if user_id != 1:
        return jsonify({"status": "Unauthorized. Only admin can perform this action."}), 403

    if request.method == 'DELETE':
        product = Products.query.filter_by(product_id=id).first()
        if not product:
            return jsonify({"status": "Product not found!"}), 404

        db.session.delete(product)
        db.session.commit()
        return jsonify({"status": "Product Deleted"}), 200

    elif request.method == 'PUT':
        product = Products.query.filter_by(product_id=id).first()
        if not product:
            return jsonify({"status": "Product not found!"}), 404

        name = request.form.get('name')
        price = request.form.get('price')
        category = request.form.get('category')
        file = request.files.get('file')

        if name:
            product.product_name = name
        if price:
            product.product_price = price
        if category:
            product.product_category = category
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            product.file_name = filename

        db.session.commit()
        return jsonify({"status": "Product Updated!"}), 200
 

        


@app.route('/showProducts', methods=['GET'])
def showProducts():
    category = request.args.get('category')
    if category and category.lower()!='no filter':
        products=Products.query.filter_by(product_category=category).all()
    else:
        products = Products.query.all()
    orders = Order_T.query.all()
    if not products:
        return jsonify({"status": "No product available"}), 404
    return jsonify({"status": "Products available", 
                     "products": [product.to_products() for product in products],
                     "orders": [order.to_dict() for order in orders]})
  


@app.route('/order', methods=['POST', 'PUT'])
@jwt_required()
def products():
    data = request.json
    print(data)
    user_id = int(get_jwt_identity())
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({"status": "user not found"}), 404
    
    if request.method=='POST':
        newOrder = Order_T(
            name=data.get('name'),
            quantity = data.get('quantity'),
            price=data.get('price'),
            category=data.get('category'),
            user_id=user_id
        )

        db.session.add(newOrder)
        orders = Order_T.query.all()
        db.session.commit()
        return jsonify({"status": "Added to Cart", 
                        'orders': [order.to_dict() for order in orders]}), 200
    
    elif request.method=='PUT':
        name = data.get('name')
        order = Order_T.query.filter_by(name=name, user_id=user_id).first()

        
        if not order:
            return jsonify({'status':'Item not found!'}), 404
        
        order.quantity += data.get('quantity',1)
        db.session.commit()
        orders = Order_T.query.filter_by(user_id=user_id).all()

        return jsonify({'status':'product added', 
                        'orders':[order.to_dict() for order in orders]}), 201
        




@app.route('/fetchOrders', methods=['GET'])
@jwt_required()
def fetchOrder():
    user_id = int(get_jwt_identity())

    # if(user_id != 1):
    orders = Order_T.query.filter_by(user_id=user_id).all()
    # else:
    #     orders = Order_T.query.all()
    
    if not orders:
        return jsonify({"status": "Cart Empty"}), 200
    return jsonify({
        'status': 'success',
        'orders': [order.to_dict() for order in orders]
    }), 200


# New route to serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/deleteItem', methods=['DELETE'])
@jwt_required()
def deleteItem():
    data = request.json
    id = data.get('id')
    
    if not id:
        return jsonify({"status": "No product found"}), 400
    
    # Check if item exists
    item = Order_T.query.filter_by(order_id=id).first()
    if not item:
        return jsonify({"status": "Item not found"}), 404
    
    # Delete the item
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({"status": "success", "message": f"Item {id} deleted successfully"}), 200


# NEW ROUTE: Update item quantity
@app.route('/updateQuantity', methods=['POST'])
@jwt_required()
def updateQuantity():
    data = request.json
    item_id = data.get('id')
    new_quantity = data.get('quantity')
    
    if not item_id or not new_quantity:
        return jsonify({"status": "Missing required fields"}), 400
    
    if new_quantity < 1:
        return jsonify({"status": "Quantity must be at least 1"}), 400
    
    # Get the item
    item = Order_T.query.filter_by(order_id=item_id).first()
    
    if not item:
        return jsonify({"status": "Item not found"}), 404
    
    # Update quantity
    item.quantity = new_quantity
    db.session.commit()
    
    return jsonify({
        "status": "success",
        "message": "Quantity updated successfully",
        "item": item.to_dict()
    }), 200


# NEW ROUTE: Checkout
@app.route('/checkout', methods=['POST', 'GET'])
@jwt_required()
def checkout():
    if request.method == 'POST':
        data = request.json
        user_id = int(get_jwt_identity())

        orders = data.get('orders', [])
        total_amount = data.get('totalAmount', 0)

        if not orders:
            return jsonify({"status": "error", "message": "No items in cart"}), 400

        checkout_items = []
        
        # Create checkout summary with default status 'pending'
        new_checkout = Checkout_Summary(
            user_id=user_id,
            total_amount=total_amount,
            status='pending'
        )
        db.session.add(new_checkout)
        db.session.flush()

        # Add checkout items
        for item in orders:
            new_item = Checkout(
                checkout_id=new_checkout.id,
                product_id=item.get('item_id'),
                product_name=item.get('name'),
                unit_price=item.get('price'),
                quantity=item.get('quantity'),
                subtotal=item.get('quantity') * item.get('price'),
            )
            checkout_items.append(new_item)

        db.session.add_all(checkout_items)
        db.session.commit()

        # Clear cart after successful checkout
        Order_T.query.filter_by(user_id=user_id).delete()
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Order placed successfully!",
            "total_amount": total_amount,
            "order_count": len(checkout_items),
            "order_id": new_checkout.id
        }), 200
    
    elif request.method == 'GET':
        user_id = int(get_jwt_identity())

        # Admin can see all orders, regular users see only their orders
        if user_id != 1:
            checkout_list = Checkout_Summary.query.filter_by(user_id=user_id).all()

        else:
            
            location = request.args.get('location')
            if location=='cart':
                checkout_list = Checkout_Summary.query.filter_by(user_id=user_id).all()
            else:
                checkout_list = Checkout_Summary.query.all()
            
        if not checkout_list:
            return jsonify({"status": "No order available", "checkout_list": []}), 200
        
        # Get checkout items for each order
        result = []
        for checkout in checkout_list:
            checkout_dict = checkout.toCheckout_dict()
            # Fetch associated items
            items = Checkout.query.filter_by(checkout_id=checkout.id).all()
            checkout_dict['items'] = [item.to_dict() for item in items]
            result.append(checkout_dict)
        
        return jsonify({
            "status": "Orders available", 
            "checkout_list": result
        }), 200


@app.route('/checkout/<int:order_id>', methods=['PUT', 'DELETE', 'GET'])
@jwt_required()
def manage_checkout(order_id):
    user_id = int(get_jwt_identity())
    
    # Get the order
    order = Checkout_Summary.query.get(order_id)
    
    if not order:
        return jsonify({"status": "error", "message": "Order not found"}), 404
    
    # Check permissions (only order owner or admin can modify)
    if user_id != 1 and order.user_id != user_id:
        return jsonify({"status": "error", "message": "Unauthorized"}), 403
    
    if request.method == 'GET':
        # Get single order details
        order_dict = order.toCheckout_dict() 
        items = Checkout.query.filter_by(checkout_id=order.id).all()

        order_dict['items'] = [item.to_dict() for item in items]
        
        return jsonify({
            "status": "success",
            "order": order_dict
        }), 200
    
    elif request.method == 'PUT':
        if user_id==1:
            # Update order status
            data = request.json
            new_status = data.get('status')

            # Validate status
            valid_statuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled']
            if new_status not in valid_statuses:
                return jsonify({
                    "status": "error", 
                    "message": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                }), 400
        else:
            return jsonify({"status":"Sorry! You are unauthorized"}), 401
        
        order.status = new_status
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": f"Order status updated to {new_status}",
            "order": order.toCheckout_dict()
        }), 200
    
    elif request.method == 'DELETE':
        if user_id==1:
            # Delete order and associated items
            try:
                # Delete associated checkout items first
                Checkout.query.filter_by(checkout_id=order_id).delete()

                # Delete the order summary
                db.session.delete(order)
                db.session.commit()

                return jsonify({
                    "status": "success",
                    "message": "Order deleted successfully"
                }), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({
                    "status": "error",
                    "message": f"Error deleting order: {str(e)}"
                }), 500
        else:
            return jsonify({"status":"Sorry! You are unauthorized"}), 401


# Helper method for Checkout model (add this to your model)
# class Checkout(db.Model):
#     # ... existing fields ...
#     
#     def to_dict(self):
#         return {
#             'id': self.id,
#             'checkout_id': self.checkout_id,
#             'product_id': self.product_id,
#             'product_name': self.product_name,
#             'unit_price': self.unit_price,
#             'quantity': self.quantity,
#             'subtotal': self.subtotal
#         }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
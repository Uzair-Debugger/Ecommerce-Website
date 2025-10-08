from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

# -------------------- CONFIGURATION --------------------
app = Flask(__name__)
# Allow credentials and specify the frontend origin for CORS
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
# Use a strong, non-default secret key in a production environment
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/flask_ecommerce'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# -------------------- MODELS --------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Order_T(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# -------------------- HELPERS --------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Try to get token from cookies first
        token = request.cookies.get("jwt_token")
        
        # If not in cookies, check Authorization header
        if not token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode the token using the secret key and algorithm
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            # Get the current user from the database using the email in the token
            current_user = User.query.filter_by(email=data['email']).first()
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# -------------------- ROUTES --------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'message': 'Missing data'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    auth = request.get_json()
    email = auth.get('email')
    password = auth.get('password')

    if not all([email, password]):
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    # Create a JWT token with the user's email and an expiration time
    token = jwt.encode({
        'email': user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Longer expiration for testing
    }, app.config['SECRET_KEY'], algorithm="HS256")

    response = make_response(jsonify({
        'message': 'Login successful', 
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200)
    
    # Set the token as a cookie with appropriate settings
    response.set_cookie(
        'jwt_token', 
        token, 
        httponly=True, 
        samesite='Lax',
        max_age=24*60*60,  # 24 hours
        domain='localhost'  # Explicitly set domain for localhost
    )
    
    return response

@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logged out successfully'}), 200)
    response.set_cookie('jwt_token', '', expires=0)
    return response

@app.route('/dashboard', methods=['GET'])
@token_required
def dashboard(current_user):
    return jsonify({
        'message': f'Welcome, {current_user.name, current_user.email}!',
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email
        }
    }), 200

@app.route('/check-auth', methods=['GET'])
def check_auth():
    """Endpoint to check if user is authenticated without strict token validation"""
    token = request.cookies.get("jwt_token")
    
    if not token:
        return jsonify({'authenticated': False}), 200
    
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = User.query.filter_by(email=data['email']).first()
        if user:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }
            }), 200
    except:
        pass
    
    return jsonify({'authenticated': False}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import db, bcrypt
from models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name, email, password = data.get('name'), data.get('email'), data.get('password')

    if not all([name, email, password]):
        return jsonify({'status': 'Input field missing!'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'User already exists!'}), 409

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, password=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'status': 'User added successfully!'}), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email, password = data.get('email'), data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'status': 'Invalid email or password'}), 401

    role = "admin" if user.email == 'uzair@gmail.com' else "customer"
    access_token = create_access_token(identity=str(user.id),
                                       additional_claims={"email": user.email, "role": role})
    return jsonify({'accessToken': access_token}), 200

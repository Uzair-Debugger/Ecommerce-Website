from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

from config import Config
from extensions import db, bcrypt, jwt
from models import Products, Order_T, Checkout, Checkout_Summary, User
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.checkout_routes import checkout_bp
from routes.compat_routes import compat_bp

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
        resources={r"/*": {"origins": app.config['CORS_ORIGINS']}},
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
    )

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(compat_bp)

    # Serve uploaded images from Supabase storage
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        from supabase_client import supabase
        # Assuming 'uploads' is the bucket name
        bucket_name = 'uploads'
        # Download the file from Supabase storage
        res = supabase.storage.from_(bucket_name).download(filename)
        if res.status_code == 200:
            # Return the file as a response
            from flask import Response
            return Response(res.content, mimetype='application/octet-stream')
        else:
            return jsonify({'error': 'File not found in Supabase storage'}), 404

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

# Vercel requires a direct app instance at module level
app = create_app()

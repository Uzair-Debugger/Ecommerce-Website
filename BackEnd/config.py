from datetime import timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/flask_ecommerce'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'super_secret_jwt_key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=5)
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

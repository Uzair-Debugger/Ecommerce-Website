from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(300))
    orders = db.relationship('Order_T', backref='user', lazy=True)
    checkouts = db.relationship('Checkout_Summary', backref='user', lazy=True)

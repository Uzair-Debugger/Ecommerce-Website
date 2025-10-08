from extensions import db

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
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'created_at': self.created_at,
            'status': self.status
        }

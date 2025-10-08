from extensions import db

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

from extensions import db

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

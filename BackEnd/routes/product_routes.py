# routes/product_routes.py
from flask import Blueprint, request, jsonify
from models import Products
from extensions import db
from supabase_client import delete_image, get_public_url, upload_image

product_bp = Blueprint('product_bp', __name__, url_prefix='/product')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ✅ Add Product
@product_bp.route('/add', methods=['POST'])
def add_product():
    name = request.form.get('product_name')
    price = request.form.get('product_price')
    category = request.form.get('product_category')
    file = request.files.get('file')

    if not all([name, price, category, file]):
        return jsonify({'status': 'Missing fields!'}), 400

    if not allowed_file(file.filename):
        return jsonify({'status': 'Invalid file type'}), 400

    storage_path = upload_image(file)

    new_product = Products(
        product_name=name,
        file_name=storage_path,
        product_price=price,
        product_category=category
    )
    db.session.add(new_product)
    db.session.commit()

    image_url = get_public_url(storage_path)

    return jsonify({
        'status': 'Product added successfully',
        'image': image_url
    }), 201


# ✅ Show Products
@product_bp.route('/show', methods=['GET'])
def show_products():
    category = request.args.get('category')
    products = Products.query.filter_by(product_category=category).all() if category else Products.query.all()

    if not products:
        return jsonify({'products': []}), 200

    product_list = []
    for p in products:
        image_url = get_public_url(p.file_name) if p.file_name else None
        product_list.append({
            'product_id': p.product_id,
            'product_name': p.product_name,
            'product_price': p.product_price,
            'product_category': p.product_category,
            'file_name': p.file_name,
            'image': image_url
        })

    return jsonify({'products': product_list}), 200


# ✅ Delete Product
@product_bp.route('/delete/<int:pid>', methods=['DELETE'])
def delete_product(pid):
    product = Products.query.get(pid)
    if not product:
        return jsonify({'status': 'Product not found'}), 404

    if product.file_name:
        try:
            delete_image(product.file_name)
        except Exception:
            pass

    db.session.delete(product)
    db.session.commit()
    return jsonify({'status': 'Product deleted successfully'}), 200


# ✅ Edit/Update Product
@product_bp.route('/update/<int:pid>', methods=['PUT'])
def update_product(pid):
    product = Products.query.get(pid)
    if not product:
        return jsonify({'status': 'Product not found'}), 404

    name = request.form.get('product_name')
    price = request.form.get('product_price')
    category = request.form.get('product_category')
    file = request.files.get('file')

    if name:
        product.product_name = name
    if price:
        product.product_price = price
    if category:
        product.product_category = category

    if file and allowed_file(file.filename):
        if product.file_name:
            try:
                delete_image(product.file_name)
            except Exception:
                pass

        product.file_name = upload_image(file)

    db.session.commit()

    return jsonify({'status': 'Product updated successfully'}), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import supabase

shop_bp = Blueprint('shop', __name__)

@shop_bp.route('/products', methods=['GET'])
def get_all_products():
    try:
        # We need to fetch products and then filter out those whose shopkeeper/user is not approved
        # Supabase joins can be complex for deep filtering, so we'll fetch and then filter or use a specific query if possible
        products = supabase.table('products').select('*, shopkeepers(*, users(*))').execute()
        
        # Filter in python for reliability with the nested structure
        approved_products = [
            p for p in products.data 
            if p.get('shopkeepers', {}).get('users', {}).get('status') == 'approved'
        ]
        
        return {'products': approved_products}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@shop_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = supabase.table('products').select('*, shopkeepers(*, users(*))').eq('id', product_id).execute()
        if product.data:
            return {'product': product.data[0]}, 200
        return {'error': 'Product not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500

@shop_bp.route('/add-product', methods=['POST'])
@jwt_required()
def add_product():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Get shopkeeper ID
        shopkeeper = supabase.table('shopkeepers').select('id').eq('user_id', user_id).execute()
        if not shopkeeper.data:
            return {'error': 'Shopkeeper not found'}, 404
        
        shopkeeper_id = shopkeeper.data[0]['id']
        
        # Add product
        result = supabase.table('products').insert({
            'shopkeeper_id': shopkeeper_id,
            'name': data['name'],
            'description': data.get('description', ''),
            'price': data['price'],
            'stock': data.get('stock', 0),
            'category': data.get('category', ''),
            'image_url': data.get('image_url', '')
        }).execute()
        
        return {'message': 'Product added successfully'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

@shop_bp.route('/delete-product/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        supabase.table('products').delete().eq('id', product_id).execute()
        return {'message': 'Product deleted'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@shop_bp.route('/admin/product/<product_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_product(product_id):
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403
            
        supabase.table('products').delete().eq('id', product_id).execute()
        return {'message': 'Product deleted by admin'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

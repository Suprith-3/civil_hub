from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import supabase

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/create', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Create order
        order = supabase.table('orders').insert({
            'user_id': user_id,
            'shopkeeper_id': data['shopkeeper_id'],
            'total_price': data['total_price'],
            'delivery_address': data.get('delivery_address', '')
        }).execute()
        
        if order.data:
            order_id = order.data[0]['id']
            
            # Add order items
            for item in data.get('items', []):
                supabase.table('order_items').insert({
                    'order_id': order_id,
                    'product_id': item['product_id'],
                    'quantity': item['quantity'],
                    'price': item['price']
                }).execute()
            
            return {'message': 'Order created', 'order_id': order_id}, 201
        
        return {'error': 'Failed to create order'}, 500
    except Exception as e:
        return {'error': str(e)}, 500

@orders_bp.route('/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = supabase.table('orders').select('*, order_items(*, products(*))').eq('id', order_id).execute()
        if order.data:
            return {'order': order.data[0]}, 200
        return {'error': 'Order not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500

@orders_bp.route('/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        data = request.json
        supabase.table('orders').update({'status': data['status']}).eq('id', order_id).execute()
        return {'message': 'Order updated'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

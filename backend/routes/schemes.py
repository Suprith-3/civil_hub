from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import supabase

schemes_bp = Blueprint('schemes', __name__)

@schemes_bp.route('', methods=['GET'])
def get_all_schemes():
    try:
        schemes = supabase.table('government_schemes').select('*').execute()
        return {'schemes': schemes.data}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@schemes_bp.route('/<scheme_id>', methods=['GET'])
def get_scheme(scheme_id):
    try:
        scheme = supabase.table('government_schemes').select('*').eq('id', scheme_id).execute()
        if scheme.data:
            return {'scheme': scheme.data[0]}, 200
        return {'error': 'Scheme not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500

@schemes_bp.route('', methods=['POST'])
@jwt_required()
def add_scheme():
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403

        data = request.json
        result = supabase.table('government_schemes').insert({
            'name': data['name'],
            'description': data['description'],
            'eligibility_criteria': data.get('eligibility_criteria', ''),
            'benefits': data.get('benefits', ''),
            'last_date': data.get('last_date'),
            'apply_link': data.get('apply_link', ''),
            'category': data.get('category', ''),
            'target_role': data.get('target_role', 'all')
        }).execute()
        
        return {'message': 'Scheme added'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

@schemes_bp.route('/admin/scheme/<scheme_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_scheme(scheme_id):
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403
            
        supabase.table('government_schemes').delete().eq('id', scheme_id).execute()
        return {'message': 'Scheme deleted by admin'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

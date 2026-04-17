from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import supabase
import hashlib
import uuid
import os

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def upload_file_to_supabase(file, bucket, folder):
    try:
        if not file:
            return None
        
        file_ext = file.filename.split('.')[-1]
        file_name = f"{folder}/{uuid.uuid4()}.{file_ext}"
        file_content = file.read()
        
        # Upload to Supabase Storage
        res = supabase.storage.from_(bucket).upload(
            path=file_name,
            file=file_content,
            file_options={"content-type": file.mimetype}
        )
        
        # Get Public URL
        url_res = supabase.storage.from_(bucket).get_public_url(file_name)
        return url_res
    except Exception as e:
        print(f"File upload error: {e}")
        return None

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # Check if it's multipart (with files) or JSON
        if request.content_type.startswith('multipart/form-data'):
            data = request.form
        else:
            data = request.json
        
        # Validate input
        required_fields = ['name', 'email', 'phone', 'password', 'role']
        if not all(field in data for field in required_fields):
            return {'error': 'Missing required fields'}, 400
        
        # PREVENT ADMIN REGISTRATION
        if data['role'] == 'admin':
            return {'error': 'Admin registration is restricted.'}, 403

        # Check if user exists
        existing = supabase.table('users').select('*').eq('email', data['email']).execute()
        if existing.data:
            return {'error': 'User already exists'}, 400
        
        # Hash password
        hashed_password = hash_password(data['password'])
        
        # Initial status
        status = 'approved' # Default for customers/workers
        if data['role'] in ['engineer', 'shop']:
            status = 'pending'
        
        # Create user
        user_data = {
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'password': hashed_password,
            'role': data['role'],
            'status': status,
            'address': data.get('address', ''),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude')
        }
        
        user = supabase.table('users').insert(user_data).execute()
        
        if user.data:
            user_id = user.data[0]['id']
            
            if data['role'] == 'engineer':
                # Handle Engineer File Uploads
                files = request.files
                degree_url = upload_file_to_supabase(files.get('degree_cert'), 'documents', 'engineers/degrees')
                dl_url = upload_file_to_supabase(files.get('dl_cert'), 'documents', 'engineers/dl')
                level_url = upload_file_to_supabase(files.get('level_cert'), 'documents', 'engineers/levels')
                
                supabase.table('engineers').insert({
                    'user_id': user_id,
                    'company_name': data.get('company_name', ''),
                    'degree_cert_url': degree_url,
                    'dl_url': dl_url,
                    'level_cert_url': level_url
                }).execute()
            
            elif data['role'] == 'worker':
                supabase.table('workers').insert({
                    'user_id': user_id,
                    'skills': data.get('skills', '[]')
                }).execute()
            
            elif data['role'] == 'shop':
                # Handle Shopkeeper File Uploads
                files = request.files
                shop_photo_url = upload_file_to_supabase(files.get('shop_photo'), 'documents', 'shops/photos')
                doc_url = upload_file_to_supabase(files.get('shop_document'), 'documents', 'shops/docs')
                
                supabase.table('shopkeepers').insert({
                    'user_id': user_id,
                    'shop_name': data.get('shop_name', ''),
                    'gst_number': data.get('gst_number', ''),
                    'shop_photo_url': shop_photo_url,
                    'document_url': doc_url
                }).execute()
            
            return {
                'message': 'Registration successful. Waiting for admin approval.' if status == 'pending' else 'User registered successfully',
                'status': status,
                'user': {
                    'id': user_id,
                    'name': data['name'],
                    'role': data['role']
                }
            }, 201
        
        return {'error': 'Failed to create user'}, 500
    
    except Exception as e:
        print(f"Register error: {e}")
        return {'error': str(e)}, 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not all(field in data for field in ['email', 'password', 'role']):
            return {'error': 'Missing email, password, or role'}, 400
        
        # HARDCODED ADMIN CHECK
        ADMIN_EMAIL = "supreethm763@gmail.com"
        ADMIN_PASSWORD = "9742446286" # Hashed in logic below

        if data['role'] == 'admin':
            if data['email'] == ADMIN_EMAIL and data['password'] == ADMIN_PASSWORD:
                # Check if email exists AT ALL
                existing_any = supabase.table('users').select('*').eq('email', ADMIN_EMAIL).execute()
                
                if not existing_any.data:
                    # Create the admin record if it doesn't exist anywhere
                    supabase.table('users').insert({
                        'name': 'Super Admin',
                        'email': ADMIN_EMAIL,
                        'phone': '9742446286',
                        'password': hash_password(ADMIN_PASSWORD),
                        'role': 'admin',
                        'status': 'approved'
                    }).execute()
                    admin_id = supabase.table('users').select('id').eq('email', ADMIN_EMAIL).single().execute().data['id']
                else:
                    user_record = existing_any.data[0]
                    admin_id = user_record['id']
                    # If it exists but role is wrong, update it to admin
                    if user_record['role'] != 'admin':
                        supabase.table('users').update({'role': 'admin', 'status': 'approved'}).eq('id', admin_id).execute()

                access_token = create_access_token(identity=admin_id)
                return {
                    'message': 'Admin Login successful',
                    'access_token': access_token,
                    'user': {
                        'id': admin_id,
                        'name': 'Admin',
                        'role': 'admin',
                        'email': ADMIN_EMAIL
                    }
                }, 200
            else:
                return {'error': 'Unauthorized Admin Credentials'}, 401

        # Regular user login
        user = supabase.table('users').select('*').eq('email', data['email']).eq('role', data['role']).execute()
        
        if not user.data:
            return {'error': 'Invalid credentials'}, 401
        
        user = user.data[0]
        
        # Check password
        if user['password'] != hash_password(data['password']):
            return {'error': 'Invalid credentials'}, 401
        
        # Check status
        if user.get('status') == 'pending' and user['role'] != 'admin':
            return {'error': 'Your account is pending admin approval.'}, 403
        elif user.get('status') == 'rejected':
            return {'error': 'Your account has been rejected by admin.'}, 403
        
        # Create JWT token
        access_token = create_access_token(identity=user['id'])
        
        return {
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'role': user['role'],
                'email': user['email']
            }
        }, 200
    
    except Exception as e:
        return {'error': str(e)}, 500

# ADMIN ROUTES
@auth_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403
            
        users = supabase.table('users').select('*').neq('role', 'admin').execute()
        return jsonify(users.data), 200
    except Exception as e:
        return {'error': str(e)}, 500

@auth_bp.route('/admin/user/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403
            
        # Delete related records first (supabase normally handles cascading if set up, but let's be safe)
        supabase.table('engineers').delete().eq('user_id', user_id).execute()
        supabase.table('shopkeepers').delete().eq('user_id', user_id).execute()
        supabase.table('workers').delete().eq('user_id', user_id).execute()
        
        # Delete main user
        supabase.table('users').delete().eq('id', user_id).execute()
        return {'message': 'User and all related data deleted successfully'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

# ADMIN ROUTES
@auth_bp.route('/admin/pending', methods=['GET'])
@jwt_required()
def get_pending_users():
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403
            
        pending = supabase.table('users').select('*, engineers(*), shopkeepers(*)').eq('status', 'pending').in_('role', ['engineer', 'shop']).execute()
        return jsonify(pending.data), 200
    except Exception as e:
        return {'error': str(e)}, 500

@auth_bp.route('/admin/approve', methods=['POST'])
@jwt_required()
def approve_user():
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403
            
        data = request.json
        user_id = data.get('user_id')
        
        supabase.table('users').update({'status': 'approved'}).eq('id', user_id).execute()
        return {'message': 'User approved successfully'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@auth_bp.route('/admin/reject', methods=['POST'])
@jwt_required()
def reject_user():
    try:
        admin_id = get_jwt_identity()
        admin = supabase.table('users').select('role').eq('id', admin_id).single().execute()
        
        if not admin.data or admin.data['role'] != 'admin':
            return {'error': 'Unauthorized'}, 403
            
        data = request.json
        user_id = data.get('user_id')
        reason = data.get('reason', '')
        
        supabase.table('users').update({'status': 'rejected', 'admin_comment': reason}).eq('id', user_id).execute()
        return {'message': 'User rejected successfully'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

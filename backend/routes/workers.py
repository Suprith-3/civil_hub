from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import supabase
import math

workers_bp = Blueprint('workers', __name__)

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in km"""
    R = 6371  # Earth radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

@workers_bp.route('', methods=['GET'])
def get_all_workers():
    try:
        workers = supabase.table('workers').select('*, users(*)').execute()
        return {'workers': workers.data}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@workers_bp.route('/nearby', methods=['GET'])
def get_nearby_workers():
    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10))  # km
        
        # Get all workers
        all_workers = supabase.table('workers').select('*, users(*)').execute()
        
        # Filter by distance
        nearby = []
        for worker in all_workers.data:
            user = worker['users']
            if user['latitude'] and user['longitude']:
                distance = calculate_distance(lat, lon, user['latitude'], user['longitude'])
                if distance <= radius:
                    worker['distance'] = round(distance, 2)
                    nearby.append(worker)
        
        # Sort by distance
        nearby.sort(key=lambda x: x['distance'])
        
        return {'workers': nearby}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@workers_bp.route('/<worker_id>', methods=['GET'])
def get_worker(worker_id):
    try:
        worker = supabase.table('workers').select('*, users(*)').eq('id', worker_id).execute()
        if worker.data:
            return {'worker': worker.data[0]}, 200
        return {'error': 'Worker not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500

@workers_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_worker_notifications():
    try:
        user_id = get_jwt_identity()
        notifications = supabase.table('notifications').select('*').eq('user_id', user_id).execute()
        return {'notifications': notifications.data}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@workers_bp.route('/assigned-work', methods=['GET'])
@jwt_required()
def get_assigned_work():
    try:
        user_id = get_jwt_identity()
        
        # Get worker ID
        worker = supabase.table('workers').select('id').eq('user_id', user_id).execute()
        if not worker.data:
            return {'error': 'Worker not found'}, 404
        
        worker_id = worker.data[0]['id']
        
        # Get assigned work
        work = supabase.table('work_assignments').select('*').eq('worker_id', worker_id).execute()
        return {'work': work.data}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@workers_bp.route('/apply-job', methods=['POST'])
@jwt_required()
def apply_for_job():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # TODO: Implement job application logic
        
        return {'message': 'Applied successfully'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

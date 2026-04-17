from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import supabase
from datetime import datetime

engineers_bp = Blueprint('engineers', __name__)

@engineers_bp.route('/workers', methods=['GET'])
@jwt_required()
def get_my_workers():
    try:
        user_id = get_jwt_identity()
        
        # Get engineer ID
        engineer = supabase.table('engineers').select('id').eq('user_id', user_id).execute()
        if not engineer.data:
            return {'error': 'Engineer not found'}, 404
        
        engineer_id = engineer.data[0]['id']
        
        # Get workers
        workers = supabase.table('engineer_workers').select('*, workers(*, users(*))').eq('engineer_id', engineer_id).execute()
        return {'workers': workers.data}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@engineers_bp.route('/add-worker', methods=['POST'])
@jwt_required()
def add_worker():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Get engineer ID
        engineer = supabase.table('engineers').select('id').eq('user_id', user_id).execute()
        if not engineer.data:
            return {'error': 'Engineer not found'}, 404
        
        engineer_id = engineer.data[0]['id']
        
        # Get worker
        worker = supabase.table('workers').select('id').eq('user_id', data['worker_user_id']).execute()
        if not worker.data:
            return {'error': 'Worker not found'}, 404
        
        worker_id = worker.data[0]['id']
        
        # Add to engineer_workers
        result = supabase.table('engineer_workers').insert({
            'engineer_id': engineer_id,
            'worker_id': worker_id,
            'salary_type': data.get('salary_type', 'daily'),
            'hourly_rate': data.get('hourly_rate', 0)
        }).execute()
        
        return {'message': 'Worker added successfully'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

@engineers_bp.route('/assign-work', methods=['POST'])
@jwt_required()
def assign_work():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Get engineer ID
        engineer = supabase.table('engineers').select('id').eq('user_id', user_id).execute()
        if not engineer.data:
            return {'error': 'Engineer not found'}, 404
        
        engineer_id = engineer.data[0]['id']
        
        # Create work assignment
        result = supabase.table('work_assignments').insert({
            'engineer_id': engineer_id,
            'worker_id': data['worker_id'],
            'task': data['task'],
            'date': data['date']
        }).execute()
        
        return {'message': 'Work assigned successfully'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

@engineers_bp.route('/take-attendance', methods=['POST'])
@jwt_required()
def take_attendance():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Get engineer ID
        engineer = supabase.table('engineers').select('id').eq('user_id', user_id).execute()
        if not engineer.data:
            return {'error': 'Engineer not found'}, 404
        
        engineer_id = engineer.data[0]['id']
        
        # Record attendance
        result = supabase.table('attendance').insert({
            'worker_id': data['worker_id'],
            'engineer_id': engineer_id,
            'date': data['date'],
            'present': data['present']
        }).execute()
        
        return {'message': 'Attendance recorded'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

@engineers_bp.route('/give-advance', methods=['POST'])
@jwt_required()
def give_advance():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Get engineer ID
        engineer = supabase.table('engineers').select('id').eq('user_id', user_id).execute()
        if not engineer.data:
            return {'error': 'Engineer not found'}, 404
        
        engineer_id = engineer.data[0]['id']
        
        # Create advance payment record
        result = supabase.table('advance_payments').insert({
            'worker_id': data['worker_id'],
            'engineer_id': engineer_id,
            'amount': data['amount'],
            'due_date': data.get('due_date'),
            'notes': data.get('notes', '')
        }).execute()
        
        return {'message': 'Advance given successfully'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

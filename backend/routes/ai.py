from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import supabase, GEMINI_API_KEY
import google.generativeai as genai

ai_bp = Blueprint('ai', __name__)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    print("Warning: GEMINI_API_KEY not found. AI features will be disabled.")
    model = None

@ai_bp.route('/recommend-products', methods=['POST'])
def recommend_products():
    if not model:
        return {'error': 'AI configuration missing'}, 503
    try:
        data = request.json
        product_name = data.get('product_name', '')
        
        prompt = f"""
        User viewed product: {product_name}
        Suggest 3 related construction materials for e-commerce.
        Return as simple list only.
        """
        
        response = model.generate_content(prompt)
        recommendations = response.text.split('\n')[:3]
        
        return {'recommendations': recommendations}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@ai_bp.route('/recommend-schemes', methods=['POST'])
def recommend_schemes():
    if not model:
        return {'error': 'AI configuration missing'}, 503
    try:
        data = request.json
        user_role = data.get('role', '')
        interests = data.get('interests', '')
        
        prompt = f"""
        User is: {user_role}
        Interests: {interests}
        
        Suggest 3 relevant Indian government schemes.
        Return as simple list only.
        """
        
        response = model.generate_content(prompt)
        recommendations = response.text.split('\n')[:3]
        
        return {'recommendations': recommendations}, 200
    except Exception as e:
        return {'error': str(e)}, 500

@ai_bp.route('/recommend-workers', methods=['POST'])
def recommend_workers():
    if not model:
        return {'error': 'AI configuration missing'}, 503
    try:
        data = request.json
        job_description = data.get('job_description', '')
        
        prompt = f"""
        Job: {job_description}
        
        Based on skills required, suggest the best worker profile.
        Return recommendation text only.
        """
        
        response = model.generate_content(prompt)
        
        return {'recommendation': response.text}, 200
    except Exception as e:
        return {'error': str(e)}, 500

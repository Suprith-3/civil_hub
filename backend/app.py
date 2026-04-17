from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
jwt = JWTManager(app)

# Import routes
from routes.auth import auth_bp
from routes.workers import workers_bp
from routes.engineers import engineers_bp
from routes.shop import shop_bp
from routes.orders import orders_bp
from routes.schemes import schemes_bp
from routes.ai import ai_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(workers_bp, url_prefix='/api/workers')
app.register_blueprint(engineers_bp, url_prefix='/api/engineers')
app.register_blueprint(shop_bp, url_prefix='/api/shop')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(schemes_bp, url_prefix='/api/schemes')
app.register_blueprint(ai_bp, url_prefix='/api/ai')

# Health check endpoints
@app.route('/', methods=['GET'])
def home():
    return {'message': 'Civil Hub API is running'}, 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return {'status': 'healthy'}, 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Resource not found'}, 404

@app.errorhandler(500)
def server_error(error):
    return {'error': 'Server error'}, 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

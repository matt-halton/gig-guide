from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from gig_backend.db.models import User, db
from utils import SECRET_KEY, ALGORITHM
import jwt

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('auth_test')
def auth_test():
    return {"message": "Auth is working."}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Check if username exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    # Create new user
    new_user = User(username=username)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created", "user": new_user.as_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'valid': False}), 400

    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return jsonify({'valid': True}), 200
    except Exception as e:
        print("Decode error:", e)
        return jsonify({'valid': False, 'error': str(e)}), 401
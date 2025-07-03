from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from gig_backend.db.models import User, db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
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
    new_user.email = email
    new_user.verified = True

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created", "user": new_user.as_dict()}), 201

@auth_bp.route('/admin_register', methods=['POST'])
@jwt_required()
def register_admin():
    claims = get_jwt()

    if claims.get('role') != 'admin':
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Check if username exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    # Create new user
    new_user = User(username=username)
    new_user.set_password(password)
    new_user.role = role
    new_user.verified = True

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created", "user": new_user.as_dict()}), 201

@auth_bp.route('/delete_user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    claims = get_jwt()

    if claims.get('role') != 'admin':
        return jsonify({"error": "Admins only"}), 403

    if user_id == 1:
        return jsonify({"error": "Cannot delete user ID 1"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"User {user_id} deleted successfully"}), 200

@auth_bp.route('/list_users', methods=['GET'])
@jwt_required()
def list_users():
    claims = get_jwt()

    if claims.get('role') != 'admin':
        return jsonify({"error": "Admins only"}), 403

    users = User.query.all()
    user_list = [user.as_dict() for user in users]

    return jsonify({"users": user_list}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    if not user.verified:
        return jsonify({"error": "Email not verified"}), 403

    claims = {"role": user.role}

    # Create JWT token
    access_token = create_access_token(identity=str(user.id), additional_claims=claims)
    return jsonify(access_token=access_token, user=user.as_dict_no_pw()), 200

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    claims = get_jwt()
    return jsonify({'valid': True, 'claims': claims}), 200

@auth_bp.route('/verify_email', methods=['GET'])
def verify_email():
    token = request.args.get('token')

    if not token:
        return "Invalid link", 400

    user = User.query.filter_by(verification_token=token).first()
    if not user:
        return "Invalid or expired token", 400

    user.verified = True
    user.verification_token = None
    db.session.commit()

    return jsonify({"message": "Email verified! You can now log in."}), 200
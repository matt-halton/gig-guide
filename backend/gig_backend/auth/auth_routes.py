from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('auth_test')
def auth_test():
    return {"message": "Auth is working."}
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from gig_backend.auth.auth_routes import auth_bp
from gig_backend.db import db
from utils import get_database_url, SECRET_KEY
from datetime import timedelta

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = get_database_url()
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

    # --- Initialise the database extension ---
    db.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp)

    @app.route('/test')
    def test():
        return {"message": "I am working."}

    return app
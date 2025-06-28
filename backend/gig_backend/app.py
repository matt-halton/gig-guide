from flask import Flask
from flask_cors import CORS
from gig_backend.auth.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(auth_bp)

    @app.route('/test')
    def test():
        return {"message": "I am working."}

    return app
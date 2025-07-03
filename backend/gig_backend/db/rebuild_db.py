from gig_backend.app import create_app
from gig_backend.db import db
from gig_backend.db.orm_base import BaseModel
import gig_backend.db.models as _models
from gig_backend.db.models import User
from utils import ADMIN_PASSWORD

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    if not User.query.filter_by(role='admin').first():
        admin = User(username='matt', role='admin', verified=True)
        admin.set_password(ADMIN_PASSWORD)
        db.session.add(admin)
        db.session.commit()

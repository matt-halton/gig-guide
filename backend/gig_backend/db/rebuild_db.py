from gig_backend.app import create_app
from gig_backend.db import db
from gig_backend.db.orm_base import BaseModel
import gig_backend.db.models as _models

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()
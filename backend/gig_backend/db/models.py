from . import db
from .orm_base import BaseModel
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime, UTC

class User(BaseModel):
    email = db.Column(db.String(120), nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')
    password_hash = db.Column(db.String(128), nullable=False)
    verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(128), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def as_dict_no_pw(self):
        return {
            c.name: getattr(self, c.name)
            for c in self.__table__.columns
            if c.name != 'password_hash'
        }


class Gig(BaseModel):
    artist = db.Column(db.String(128), nullable=False)
    venue = db.Column(db.String(128), nullable=False)
    gig_datetime = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(UTC))

class Favourite(BaseModel):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('gig.id'), nullable=False)
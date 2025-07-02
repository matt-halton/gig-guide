from flask import Blueprint, request, jsonify
from datetime import datetime
from gig_backend.db.models import Gig, Favourite, db
from flask_jwt_extended import jwt_required, get_jwt

gig_bp = Blueprint('gig_bp', __name__, url_prefix='/gigs')

@gig_bp.route('/create', methods=['POST'])
@jwt_required()
def create_gig():
    claims = get_jwt()

    if claims.get('role') != 'admin':
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json()

    artist = data.get('artist')
    venue = data.get('venue')
    gig_datetime_str = data.get('gig_datetime')

    if not all([artist, venue, gig_datetime_str]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        gig_datetime = datetime.fromisoformat(gig_datetime_str)
    except ValueError:
        return jsonify({"error": "Invalid datetime format. Use ISO 8601."}), 400

    new_gig = Gig(
        artist=artist,
        venue=venue,
        gig_datetime=gig_datetime
    )

    db.session.add(new_gig)
    db.session.commit()

    return jsonify({"message": "Gig created", "gig_id": new_gig.id}), 201

@gig_bp.route('/all', methods=['GET'])
def get_all_gigs():
    gigs = Gig.query.all()
    result = []
    for gig in gigs:
        result.append({
            'id': gig.id,
            'artist': gig.artist,
            'venue': gig.venue,
            'gig_datetime': gig.gig_datetime.isoformat()
        })
    return jsonify(result), 200

@gig_bp.route('/add_favourite', methods=['POST'])
@jwt_required()
def add_favourite():
    data = request.get_json()

    user_id = data.get('user_id')
    event_id = data.get('event_id')

    if not all([user_id, event_id]):
        return jsonify({"error": "Missing required fields"}), 400

    existing = Favourite.query.filter_by(user_id=user_id, event_id=event_id).first()
    if existing:
        return jsonify({"error": "Favourite already exists"}), 409

    new_favourite = Favourite(
        user_id=user_id,
        event_id=event_id,
    )

    db.session.add(new_favourite)
    db.session.commit()

    return jsonify({"message": "Favourite created", "user_id": user_id}), 201

@gig_bp.route('/user_favourites', methods=['POST'])
@jwt_required()
def get_user_favourites():
    data = request.get_json()

    user_id = data.get('user_id')

    user_favourites = Favourite.query.filter_by(user_id=user_id).all()
    event_ids = [fav.event_id for fav in user_favourites]

    if not event_ids:
        return jsonify([]), 200

    # Fetch gigs that match those event IDs
    gigs = Gig.query.filter(Gig.id.in_(event_ids)).all()

    gigs_list = [gig.as_dict() for gig in gigs]

    return jsonify(gigs_list), 200
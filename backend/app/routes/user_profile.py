from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.models.user_profile import UserProfile
from app.models.user import User
from app.utils.auth_utils import token_required
from datetime import datetime
import jwt
from flask import current_app

profile_bp = Blueprint('profile', __name__, url_prefix='/api')

@profile_bp.route('/user/profile', methods=['POST'])
@token_required
def update_user_profile():
    data = request.get_json()

    profile = UserProfile.query.filter_by(user_id=g.user.id).first()
    if not profile:
        profile = UserProfile(user_id=g.user.id)

    profile.first_name = data.get("first_name")
    profile.last_name = data.get("last_name")
    
    birth_str = data.get("birthdate")
    profile.birthdate = datetime.strptime(birth_str, '%Y-%m-%d').date() if birth_str else None

    db.session.add(profile)
    db.session.commit()

    return jsonify({"message": "Profile saved successfully"}), 200

@profile_bp.route('/user/profile', methods=['GET'])
@token_required
def get_profile():
    profile = UserProfile.query.filter_by(user_id=g.user.id).first()
    
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify(profile.to_dict()), 200

@profile_bp.route('/user/complete-profile', methods=['POST'])
def complete_profile():
    data = request.get_json()
    token = data.get('token')
    if not token:
        return jsonify({'error': 'Missing token.'}), 400

    try:
        payload = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=[current_app.config['JWT_ALGORITHM']]
        )
        user_id = payload.get('user_id')
    except Exception:
        return jsonify({'error': 'Invalid or expired token.'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found.'}), 404

    # Ulož profilová data
    profile = UserProfile.query.filter_by(user_id=user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id)
    profile.first_name = data.get('first_name')
    profile.last_name = data.get('last_name')
    profile.gender = data.get('gender')
    birthdate = data.get('birthdate')
    if birthdate:
        from datetime import datetime
        profile.birthdate = datetime.strptime(birthdate, '%Y-%m-%d').date()
    db.session.add(profile)

    # Aktivuj účet
    user.is_active = True
    db.session.commit()

    return jsonify({'message': 'Profile completed!'}), 200

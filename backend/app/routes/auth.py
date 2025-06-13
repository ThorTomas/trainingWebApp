# app/routes/auth.py

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import logging

from app.services.auth_service import (
    register_user, check_login_credentials, generate_token, generate_user_management_token,
    validate_password_strength, verify_reset_token, reset_user_password
)
from app.models.user import User
from app import db, limiter
from app.utils.email_utils import send_activation_email, send_password_reset_email

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user, error = register_user(data['username'], data['email'], data['password'])

    if error:
        return jsonify({"error": error}), 400

    user.is_active = False  # uživatel není aktivní
    db.session.add(user)
    db.session.commit()

    # Vygeneruj aktivační token (např. JWT nebo UUID)
    activation_token = generate_user_management_token(user)
    send_activation_email(user.email, activation_token)

    return jsonify({
        "message": "Registration successful! Please check your email to complete your profile.",
    }), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user, error = check_login_credentials(data['identifier'], data['password'])

    if error:
        return jsonify({"error": error}), 401

    token = generate_token(user.id)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "username": user.username
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("1 per minute")
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Email not found.'}), 404

    # Vygeneruj reset token (můžeš použít stejnou logiku jako pro aktivaci)
    reset_token = generate_user_management_token(user)
    user.reset_token = reset_token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=2)
    db.session.commit()
    send_password_reset_email(user.email, reset_token)

    return jsonify({'message': 'Reset instructions sent.'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')
    if not token or not new_password:
        return jsonify({'error': 'Missing token or new password.'}), 400

    password_error = validate_password_strength(new_password)
    if password_error:
        return jsonify({'error': password_error}), 400

    user = verify_reset_token(token)
    if not user:
        return jsonify({'error': 'Invalid or expired token.'}), 400

    reset_user_password(user, new_password)
    db.session.commit()
    return jsonify({'message': 'Password has been reset.'}), 200


# app/services/auth_service.py

import jwt
import logging
from datetime import datetime, timedelta
from flask import current_app
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(username, email, password):
    if len(username) < 4:
        return None, "Username must be at least 4 characters long."
    password_validation_error = validate_password_strength(password)
    if password_validation_error:
        return None, password_validation_error
    if User.query.filter_by(email=email).first():
        logging.error("Email already registered")
        return None, "Email already registered"
    if User.query.filter_by(username=username).first():
        logging.error("Username already taken")
        return None, "Username already taken"

    user = User(username=username, email=email)
    user.set_password(password)
    
    return user, None

def check_login_credentials(identifier, password):
    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
    if user is None:
        logging.error("User not found")
        return None, "User not found"
    if not user.check_password(password):
        logging.error("Incorrect password")
        return None, "Incorrect password"
    return user, None

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token valid for 1 day
    }
    token = jwt.encode(
        payload,
        current_app.config['SECRET_KEY'],
        algorithm=current_app.config['JWT_ALGORITHM']
    )
    return token

def generate_user_management_token(user):
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(hours=2)  # platnost 2 hodiny
    }
    token = jwt.encode(
        payload,
        current_app.config['SECRET_KEY'],
        algorithm=current_app.config['JWT_ALGORITHM']
    )
    return token

def validate_password_strength(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not any(char.isdigit() for char in password):
        return "Password must contain at least one digit."
    if not any(char.isalpha() for char in password):
        return "Password must contain at least one letter."
    return None

def verify_reset_token(token):
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.reset_token_expiry < datetime.utcnow():
        return None
    return user

def reset_user_password(user, new_password):
    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None


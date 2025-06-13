# app/utils/auth_utils.py

import jwt
from flask import current_app, request, jsonify, g
from app.models.user import User
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({'message': 'Token is missing!'}), 401

        token = auth_header.split(" ")[1]

        try:
            data_decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=[current_app.config['JWT_ALGORITHM']])
            user = User.query.get(data_decoded['user_id'])
            if not user:
                return jsonify({'error': 'User not found!'}), 401
            g.user = user

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token!'}), 401

        return f(*args, **kwargs)
    return decorated
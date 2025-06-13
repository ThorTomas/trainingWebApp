# app/__init__.py

from flask import Flask
import logging
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .extensions import db, limiter
from .routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Set up logging
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)s] %(message)s"
    )

    # App configuration
    app.config.from_pyfile('config.py')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///training.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Blueprint registration (routes)
    from .routes.auth import auth_bp
    from .routes.user_profile import profile_bp
    from .routes.training import training_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(training_bp)
    # Add more blueprints as needed...

    # Initialize extensions (SQLAlchemy)
    db.init_app(app)
    limiter.init_app(app)
    from . import models # Import models to register them with SQLAlchemy

    logging.debug("Application created and blueprints registered.")

    return app
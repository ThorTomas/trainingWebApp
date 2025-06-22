# app/routes/training.py
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.models.training_day import TrainingDay
from app.models.training_record import UserTrainingRecord
from app.models.season import Season
from app.utils.auth_utils import token_required
from datetime import date, timedelta
import logging
from app.utils.training_utils import get_main_ttype_definitions, get_sub_ttype_definitions
from app.services.training_service import (
    get_training_records, create_training_record, update_training_record,
    get_or_create_training_days, get_or_create_season
)
from sqlalchemy.exc import IntegrityError

training_bp = Blueprint("training", __name__, url_prefix="/api")

@training_bp.route("/training", methods=["GET"])
@token_required
def get_training():
    year = request.args.get("year", type=int)
    if not year:
        return jsonify({"error": "Year is required"}), 400
    result = get_training_records(g.user.id, year)
    return jsonify(result)

@training_bp.route("/training", methods=["POST"])
@token_required
def create_training():
    try:
        data = request.get_json()
        record = create_training_record(g.user.id, data)
        return jsonify({"message": "Training created", "training": record}), 201
    except Exception as e:
        logging.error(f"Failed to create training: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@training_bp.route("/training/<int:record_id>", methods=["PUT"])
@token_required
def update_training(record_id):
    record = UserTrainingRecord.query.get(record_id)
    if not record or record.user_id != g.user.id:
        return jsonify({"error": "Not found or unauthorized"}), 404
    try:
        data = request.get_json()
        updated = update_training_record(record, data)
        return jsonify({"message": "Training updated", "training": updated})
    except Exception as e:
        logging.error(f"Failed to update training: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@training_bp.route("/training/<int:record_id>", methods=["DELETE"])
@token_required
def delete_training(record_id):
    record = UserTrainingRecord.query.get(record_id)
    if not record or record.user_id != g.user.id:
        return jsonify({"error": "Not found or unauthorized"}), 404
    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Training deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal Server Error"}), 500

@training_bp.route('/training/types', methods=['GET'])
def get_training_types():
    """
    Vrací hlavní typy tréninků a jejich subtypy.
    Pokud je v query parametru main_type, vrací pouze subtypy pro daný hlavní typ.
    """
    main_type = request.args.get("main_type")
    if main_type:
        subtypes = get_sub_ttype_definitions(main_type)
        return jsonify(subtypes), 200
    else:
        main_types = get_main_ttype_definitions()
        return jsonify(main_types), 200

@training_bp.route('/training/types/all', methods=['GET'])
def get_all_training_types():
    """
    Vrací všechny hlavní typy i všechny subtypy (pro administraci nebo editory).
    """
    main_types = get_main_ttype_definitions()
    all_subtypes = get_sub_ttype_definitions()
    return jsonify({
        "main_types": main_types,
        "sub_types": all_subtypes
    }), 200

@training_bp.route('/seasons', methods=['GET'])
@token_required
def get_seasons():
    seasons = Season.query.order_by(Season.year).all()
    years = [s.year for s in seasons]
    return jsonify(years), 200

@training_bp.route('/seasons', methods=['POST'])
@token_required
def create_season():
    data = request.get_json()
    year = int(data.get('year'))
    if not year:
        return jsonify({"error": "Year is required"}), 400
    season = Season.query.filter_by(year=year).first()
    if season:
        return jsonify({"message": "Season already exists", "year": year}), 200
    start_date = date(year - 1, 11, 1)
    end_date = date(year, 10, 31)
    season = Season(year=year, start_date=start_date, end_date=end_date)
    db.session.add(season)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Season already exists (race condition)", "year": year}), 200
    # vytvoření dnů v sezóně
    delta = (end_date - start_date).days + 1
    days = []
    for i in range(delta):
        days.append(start_date + timedelta(days=i))
    # Najdi první pondělí
    first_monday_idx = next((i for i, d in enumerate(days) if d.weekday() == 0), 0)
    for i, day_date in enumerate(days):
        if i < first_monday_idx:
            cycle = 0
        else:
            cycle = ((i - first_monday_idx) // 7) + 1
            if cycle > 12:
                cycle = 13
        day = TrainingDay(
            season_id=season.id,
            date=day_date,
            day_index=i + 1,
            cycle=cycle
        )
        db.session.add(day)
    db.session.commit()
    return jsonify({"message": "Season created", "year": year}), 201

@training_bp.route('/training/days', methods=['GET'])
@token_required
def get_training_days():
    year = request.args.get("year", type=int)
    if not year:
        return jsonify({"error": "Year is required"}), 400
    result = get_or_create_training_days(year)
    return jsonify(result), 200
from app.models.training_day import TrainingDay
from app.models.training_record import UserTrainingRecord
from app.models.season import Season
from app.extensions import db
from datetime import date, timedelta
import logging

def get_or_create_season(year):
    season = Season.query.filter_by(year=year).first()
    if not season:
        start_date = date(year - 1, 11, 1)
        end_date = date(year, 10, 31)
        season = Season(year=year, start_date=start_date, end_date=end_date)
        db.session.add(season)
        db.session.commit()
        # vytvoř dny v sezóně
        delta = (end_date - start_date).days + 1
        for i in range(delta):
            day = TrainingDay(
                season_id=season.id,
                date=start_date + timedelta(days=i),
                day_index=i + 1
            )
            db.session.add(day)
        db.session.commit()
    return season

def get_training_records(user_id, year):
    season = get_or_create_season(year)
    days = TrainingDay.query.filter_by(season_id=season.id).all()
    day_ids = [day.id for day in days]
    records = UserTrainingRecord.query.filter(
        UserTrainingRecord.user_id == user_id,
        UserTrainingRecord.training_day_id.in_(day_ids)
    ).all()
    return [rec.to_dict() for rec in records]

def create_training_record(user_id, data):
    record = UserTrainingRecord(
        user_id=user_id,
        training_day_id=data["training_day_id"],
        slot=data["slot"],
        name=data.get("name"),
        training_type=data.get("training_type"),
        detail=data.get("detail"),
        completed=data.get("completed", False),
        notes=data.get("notes"),
        distance=data.get("distance", 0.0),
        duration=data.get("duration", 0)
    )
    db.session.add(record)
    db.session.commit()
    return record.to_dict()

def update_training_record(record, data):
    record.name = data.get("name", record.name)
    record.training_type = data.get("training_type", record.training_type)
    record.detail = data.get("detail", record.detail)
    record.completed = data.get("completed", record.completed)
    db.session.commit()
    return record.to_dict()

def get_or_create_training_days(year):
    season = get_or_create_season(year)
    days = TrainingDay.query.filter_by(season_id=season.id).all()
    return [
        {"id": day.id, "date": day.date.isoformat(), "day_index": day.day_index}
        for day in days
    ]

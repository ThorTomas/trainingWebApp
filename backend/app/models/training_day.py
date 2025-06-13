# app/models/training_day.py
from app.extensions import db

class TrainingDay(db.Model):
    __tablename__ = 'training_days'

    id = db.Column(db.Integer, primary_key=True)
    season_id = db.Column(db.Integer, db.ForeignKey('seasons.id'), nullable=False)
    day_index = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False, unique=True)

    user_records = db.relationship('UserTrainingRecord', backref='training_day', lazy=True)

    def __repr__(self):
        return f"<TrainingDay {self.date}>"

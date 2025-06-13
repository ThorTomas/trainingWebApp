# app/models/season.py
from app.extensions import db

class Season(db.Model):
    __tablename__ = 'seasons'

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, unique=True, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    training_days = db.relationship('TrainingDay', backref='season', lazy=True)

    def __repr__(self):
        return f"<Season {self.year}>"
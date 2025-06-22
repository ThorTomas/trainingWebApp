# app/models/training_record.py
from app.extensions import db

class UserTrainingRecord(db.Model):
    __tablename__ = 'user_training_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    training_day_id = db.Column(db.Integer, db.ForeignKey('training_days.id'), nullable=False)
    slot = db.Column(db.Integer, nullable=False)  # Slot number for the training record

    name = db.Column(db.String(100)) # Name of the training
    main_ttype = db.Column(db.String(50))  # e.g. "Run", "Bike", "Swim", "Strength"
    sub_ttype = db.Column(db.String(50))  # e.g. "AP", "ANP", "Rege", "Athletic"
    detail = db.Column(db.String(50))  # e.g. "1×40’" or "3×1000m"
    completed = db.Column(db.Boolean, default=False)  # Whether the training was completed
    notes = db.Column(db.Text)  # Notes for the training record
    distance = db.Column(db.Float, default=0.0)  # Distance covered in the training (in kilometers)
    duration = db.Column(db.Integer, default=0)  # Duration of the training in minutes
    time = db.Column(db.String(8))  # Time of the activity (HH:MM:SS)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'training_day_id', 'slot', name='uq_user_day_slot'),
    )


    def __repr__(self):
        return f"<TrainingRecord {self.id} for User {self.user_id} on Day {self.training_day_id}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'training_day_id': self.training_day_id,
            'slot': self.slot,
            'name': self.name,
            'm': self.main_ttype,
            's': self.sub_ttype,
            'detail': self.detail,
            'completed': self.completed,
            'notes': self.notes,
            'distance': self.distance,
            'duration': self.duration,
            'time': self.time
        }
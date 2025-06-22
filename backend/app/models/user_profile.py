# app/models/userProfile.py
from app.extensions import db
from app.models.user import User

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    birthdate = db.Column(db.Date)
    gender = db.Column(db.String(20))
    coach_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # odkaz na trenéra

    user = db.relationship(
        "User",
        back_populates="profile",
        foreign_keys=[user_id]
    )
    coach = db.relationship(
        "User",
        foreign_keys=[coach_id],
        backref="clients"
    )

    def to_dict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birthdate": self.birthdate.isoformat() if self.birthdate else None,
            "gender": self.gender,
            "coach": {
                "id": self.coach.id,
                "username": self.coach.username,
                "first_name": self.coach.profile.first_name if self.coach and self.coach.profile else None,
                "last_name": self.coach.profile.last_name if self.coach and self.coach.profile else None,
            } if self.coach else None
        }
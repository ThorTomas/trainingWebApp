# app/models/userProfile.py
from app.extensions import db

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

    user = db.relationship("User", back_populates="profile")

    def to_dict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birthdate": self.birthdate.isoformat() if self.birthdate else None,
            "gender": self.gender
        }
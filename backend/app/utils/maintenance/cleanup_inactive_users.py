import logging
from app.extensions import db
from app.models.user import User
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")

def print_user_stats():
    active = User.query.filter_by(is_active=True).count()
    inactive = User.query.filter_by(is_active=False).count()
    logging.info(f"Active accounts: {active}")
    logging.info(f"Inactive accounts: {inactive}")

def delete_old_inactive_users():
    ten_minutes_ago = datetime.utcnow() - timedelta(minutes=10)
    users_to_delete = User.query.filter(
        User.is_active == False,
        User.created_at < ten_minutes_ago
    ).all()
    logging.info(f"Inactive accounts to delete: {len(users_to_delete)} (older than 10 minutes)")
    for user in users_to_delete:
        db.session.delete(user)
    db.session.commit()

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        logging.info("Stats before cleanup:")
        print_user_stats()
        delete_old_inactive_users()
        logging.info("Stats after cleanup:")
        print_user_stats()
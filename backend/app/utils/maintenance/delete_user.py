import sys
from app.extensions import db
from app.models.user import User

def delete_user(identifier):
    """
    Delete a user by id (int), username or email (string).
    """
    user = None
    if identifier.isdigit():
        user = User.query.get(int(identifier))
    elif "@" in identifier:
        user = User.query.filter_by(email=identifier).first()
    else:
        user = User.query.filter_by(username=identifier).first()

    if not user:
        print(f"User '{identifier}' not found.")
        return

    # Try to get first and last name from profile if exists
    first_name = user.profile.first_name if user.profile and hasattr(user.profile, "first_name") else "(not set)"
    last_name = user.profile.last_name if user.profile and hasattr(user.profile, "last_name") else "(not set)"

    print(
        f"User deleted:\n"
        f"  ID: {user.id}\n"
        f"  Username: {user.username}\n"
        f"  Email: {user.email}\n"
        f"  First name: {first_name}\n"
        f"  Last name: {last_name}"
    )
    db.session.delete(user)
    db.session.commit()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m app.utils.delete_user <username|email|id>")
        sys.exit(1)

    from app import create_app
    app = create_app()
    with app.app_context():
        delete_user(sys.argv[1])
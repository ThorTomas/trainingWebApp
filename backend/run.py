from app import create_app, db
import logging

app = create_app()

if __name__ == '__main__':
    logging.info("Starting Flask server at http://127.0.0.1:5000")

    # Initialize the database (create tables)
    with app.app_context():
        db.create_all()
        logging.info("Database tables created.")
    
    app.run(debug=True)
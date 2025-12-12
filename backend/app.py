import os
from flask import Flask
from dotenv import load_dotenv
from .database import engine, Base
from .routes import bp
from flask_cors import CORS
load_dotenv()
def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'changeit')
# Register routes
    app.register_blueprint(bp, url_prefix='/api')
# Create tables if they don't exist (dev)
    Base.metadata.create_all(bind=engine)
    return app
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)

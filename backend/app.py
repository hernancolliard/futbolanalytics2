from flask import Flask
from flask_cors import CORS
from database import init_db
from routes import bp as api_bp
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py', silent=True)
    app.config["JWT_SECRET_KEY"] = "super-secret"  # CAMBIAR EN PROD

    #  CORS PRIMERO
    CORS(
        app,
        resources={r"/api/*": {
            "origins": [
                "https://futbolanalytics2-1.onrender.com"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }}
    )

    #  JWT DESPUÉS
    jwt = JWTManager(app)

    #  DB
    init_db()

    #  Blueprint al final
    app.register_blueprint(api_bp, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)


from flask import Flask
from flask_cors import CORS
import os
import sys

# Asegurar que la raíz del proyecto está en sys.path para que imports como
# `backend.database` funcionen tanto en local como en despliegues (gunicorn).
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Intentar importar módulos desde el paquete `backend` o como módulos locales.
try:
    from backend.database import init_db
    from backend.routes import bp as api_bp
except Exception:
    from database import init_db
    from routes import bp as api_bp
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py', silent=True)
    app.config["JWT_SECRET_KEY"] = "super-secret"  # CAMBIAR EN PROD

    #  CORS PRIMERO
    # Configurar orígenes permitidos para CORS. En producción, establezca
    # la variable de entorno `FRONTEND_URL` en la URL de la app frontend.
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    allowed_origins = [frontend_url, "https://futbolanalytics2-1.onrender.com"]

    CORS(
        app,
        resources={r"/api/*": {
            "origins": allowed_origins,
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


# Futbol Analytics

## Despliegue y notas rápidas

Backend:

- Recomendado: desplegar usando el `Dockerfile` incluido (usa `python:3.11-slim`).
- Si no usas Docker, fuerza Python 3.11 en el entorno (añadí `backend/runtime.txt`).
- Variables de entorno necesarias en el entorno de despliegue:

  - `DATABASE_URL` — URL de la base de datos (Postgres).
  - `JWT_SECRET_KEY` — clave JWT.
  - `FRONTEND_URL` — URL pública del frontend (ej. `https://<tu-app>.onrender.com`).

- CORS: el backend permite orígenes definidos por `FRONTEND_URL` y `http://localhost:5173`.

Frontend:

- Establece `VITE_API_URL` en las Environment Variables del servicio frontend en Render para que las llamadas apunten a la API (ej. `https://<api>.onrender.com/api`).

Problema local detectado:

- Al intentar ejecutar el backend localmente con Python 3.13, la importación de `SQLAlchemy` falla (incompatibilidad de typing internals). Por eso recomiendo usar Python 3.11 (ya indicado en `backend/runtime.txt`) o desplegar con el `Dockerfile`.

Si quieres, aplico cambios extra (p. ej. fijar versiones en `requirements.txt` o crear un `.render.yaml`) — dime cómo prefieres proceder.

### Ejecutar backend en Docker (rápido y práctico)

He añadido `docker-compose.yml` para arrancar el backend en un contenedor con Python 3.11 y una base de datos SQLite local (útil para desarrollo y evitar incompatibilidades de SQLAlchemy con Python 3.13).

Comandos para arrancar (desde la raíz del repo):

```bash
docker compose up --build backend
```

Esto construye la imagen usando `backend/Dockerfile` (que usa `python:3.11-slim`) e iniciará el servidor en `http://localhost:5000`.

Archivos y variables importantes:

- `docker-compose.yml`: servicio `backend` (puerto 5000). Usa `DATABASE_URL=sqlite:///./backend.db` y monta `./backend/uploads`.
- Si quieres usar Postgres, sustituye `DATABASE_URL` por tu URL de Postgres en el `docker-compose.yml`.

Después de arrancar el backend en Docker, puedes levantar el frontend en modo dev y apuntarlo a la API local:

```bash
# en otra terminal
cd frontend
VITE_API_URL=http://localhost:5000/api npm run dev
```

Con esto podrás probar la UI completa y comprobar que los botones funcionan con la API real.

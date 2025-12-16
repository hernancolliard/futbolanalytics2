FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
ENV FLASK_APP=app.py
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app()"]
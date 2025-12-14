import os
import boto3
from botocore.exceptions import NoCredentialsError
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session
from database import get_db
from models import Match, Event, User
from schemas import MatchSchema, EventSchema, UserSchema
bp = Blueprint('api', __name__)
ALLOWED_EXT = {'mp4', 'mov', 'avi', 'mkv'}
def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT

def _upload_to_s3(file, filename):
    s3 = boto3.client(
       's3',
       aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
       aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
       region_name=os.getenv('S3_REGION')
    )
    bucket_name = os.getenv('S3_BUCKET')
    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            filename,
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": file.content_type
            }
        )
        return f"https://{bucket_name}.s3.{os.getenv('S3_REGION')}.amazonaws.com/{filename}"
    except NoCredentialsError:
        raise Exception("AWS credentials not available")


@bp.route('/matches', methods=['GET'])
def list_matches():
  db = next(get_db())

  matches = db.query(Match).order_by(Match.date.desc()).all()
  return jsonify(MatchSchema(many=True).dump(matches))
@bp.route('/matches', methods=['POST'])
def create_match():
  db = next(get_db())
  title = request.form.get('title')
  date = request.form.get('date')
  venue = request.form.get('venue')
  file = request.files.get('video')
  video_path = None
  if file and allowed_file(file.filename):
    filename = secure_filename(file.filename)
    try:
        video_path = _upload_to_s3(file, filename)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

  match = Match(title=title, date=date or None, venue=venue,
video_path=video_path)
  db.add(match)
  db.commit()
  db.refresh(match)
  return jsonify(MatchSchema().dump(match)), 201

@bp.route('/matches/<int:match_id>/video', methods=['POST'])
def upload_video_to_s3(match_id):
    db = next(get_db())
    match = db.query(Match).get(match_id)
    if not match:
        return jsonify({"error": "Match not found"}), 404

    file = request.files.get('video')
    if not file or not allowed_file(file.filename):
        return jsonify({"error": "File not allowed or not provided"}), 400

    filename = secure_filename(file.filename)
    try:
        video_url = _upload_to_s3(file, filename)
        match.video_path = video_url
        db.commit()
        return jsonify({"message": "Video uploaded successfully", "url": video_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
  return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
# Minimal event endpoint
@bp.route('/matches/<int:match_id>/events', methods=['POST'])
def add_event(match_id):
  db = next(get_db())
  data = request.get_json()
  ev = Event(match_id=match_id, event_type=data.get('event_type'), minute=data.get('minute'), x=data.get('x'), y=data.get('y'), meta_data=data.get('metadata'))
  db.add(ev)
  db.commit()
  db.refresh(ev)
  return jsonify(EventSchema().dump(ev)), 201

@bp.route('/players', methods=['GET'])
def list_players():
    db = next(get_db())
    players = db.query(User).all()
    return jsonify(UserSchema(many=True).dump(players))
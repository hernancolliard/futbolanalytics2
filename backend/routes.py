import os
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session
from .database import get_db
from .models import Match, Event, User
from .schemas import MatchSchema, EventSchema
bp = Blueprint('api', __name__)
ALLOWED_EXT = {'mp4', 'mov', 'avi', 'mkv'}
def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT
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
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)
    path = os.path.join(upload_folder, filename)
    file.save(path)
    video_path = path
  match = Match(title=title, date=date or None, venue=venue,
video_path=video_path)
  db.add(match)
  db.commit()
  db.refresh(match)
  return jsonify(MatchSchema().dump(match)), 201
@bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
  return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
# Minimal event endpoint
@bp.route('/matches/<int:match_id>/events', methods=['POST'])
def add_event(match_id):
  db = next(get_db())
  data = request.get_json()
  ev = Event(match_id=match_id, event_type=data.get('event_type'),
minute=data.get('minute'), x=data.get('x'), y=data.get('y'),
metadata=data.get('metadata'))
  db.add(ev)
  db.commit()
  db.refresh(ev)
  return jsonify(EventSchema().dump(ev)), 201
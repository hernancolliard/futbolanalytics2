from flask_jwt_extended import create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from schemas import MatchSchema, EventSchema, UserSchema, CustomButtonSchema
from models import Match, Event, User, CustomButton
from database import get_db
from sqlalchemy.orm import Session
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app, send_from_directory
import boto3
from botocore.exceptions import NoCredentialsError
import os

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
@jwt_required()
def list_matches():
  db = next(get_db())

  matches = db.query(Match).order_by(Match.date.desc()).all()
  return jsonify(MatchSchema(many=True).dump(matches))
@bp.route('/matches', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@bp.route('/matches/<int:match_id>/events', methods=['GET'])
@jwt_required()
def get_events(match_id):
    db = next(get_db())
    match = db.query(Match).get(match_id)
    if not match:
        return jsonify({"error": "Match not found"}), 404
    return jsonify(EventSchema(many=True).dump(match.events))

# Minimal event endpoint
@bp.route('/matches/<int:match_id>/events', methods=['POST'])
@jwt_required()
def add_event(match_id):
  db = next(get_db())
  data = request.get_json()
  ev = Event(
      match_id=match_id, 
      time=data.get('time'),
      player=data.get('player'),
      action=data.get('action'),
      result=data.get('result'),
      x=data.get('x'),
      y=data.get('y'),
      meta_data=data.get('metadata')
  )
  db.add(ev)
  db.commit()
  db.refresh(ev)
  return jsonify(EventSchema().dump(ev)), 201

@bp.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    db = next(get_db())
    event = db.query(Event).get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return jsonify(EventSchema().dump(event))

@bp.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    db = next(get_db())
    event = db.query(Event).get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    db.delete(event)
    db.commit()
    return jsonify({"message": "Event deleted successfully"}), 200





@bp.route('/players', methods=['GET'])
@jwt_required()
def list_players():
    db = next(get_db())
    players = db.query(User).all()
    return jsonify(UserSchema(many=True).dump(players))

@bp.route('/register', methods=['POST'])

def register():
    db = next(get_db())
    try:
        data = request.get_json()
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            email=data['email'],
            name=data['name'],
            password_hash=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user) # Refresh user to get its ID
        print(f"New user ID: {new_user.id}") # Debugging
        access_token = create_access_token(identity=new_user.id) # Generate token for new user
        return jsonify(access_token=access_token), 201
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Registration failed: {str(e)}"}), 400
    finally:
        db.close()



@bp.route('/login', methods=['POST'])



def login():



    db = next(get_db())



    data = request.get_json()



    print(f"Attempting login for email: {data['email']}") # Debugging



    user = db.query(User).filter_by(email=data['email']).first()



    if user:



        print(f"User found: {user.email}") # Debugging



        if check_password_hash(user.password_hash, data['password']):



            print("Password check successful.") # Debugging



            access_token = create_access_token(identity=user.id)



            return jsonify(access_token=access_token)



        else:



            print("Password check failed.") # Debugging



    else:



        print("User not found.") # Debugging



    return jsonify({"message": "Invalid credentials"}), 401



@bp.route('/buttons', methods=['GET'])

@jwt_required()

def list_buttons():

    db = next(get_db())

    buttons = db.query(CustomButton).all()

    return jsonify(CustomButtonSchema(many=True).dump(buttons))



@bp.route('/buttons', methods=['POST'])

@jwt_required()

def create_button():

    db = next(get_db())

    data = request.get_json()

    button = CustomButton(name=data['name'], color=data.get('color'))

    db.add(button)

    db.commit()

    db.refresh(button)

    return jsonify(CustomButtonSchema().dump(button)), 201



@bp.route('/buttons/<int:button_id>', methods=['PUT'])

@jwt_required()

def update_button(button_id):

    db = next(get_db())

    button = db.query(CustomButton).get(button_id)

    if not button:

        return jsonify({"error": "Button not found"}), 404

    data = request.get_json()

    button.name = data.get('name', button.name)

    button.color = data.get('color', button.color)

    db.commit()

    db.refresh(button)

    return jsonify(CustomButtonSchema().dump(button))



@bp.route('/buttons/<int:button_id>', methods=['DELETE'])

@jwt_required()

def delete_button(button_id):

    db = next(get_db())

    button = db.query(CustomButton).get(button_id)

    if not button:

        return jsonify({"error": "Button not found"}), 404

    db.delete(button)

    db.commit()

    return jsonify({"message": "Button deleted successfully"}), 200



from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import Session, joinedload
from database import get_db
import models
import schemas

bp = Blueprint('api', __name__)

# Helper function to get db session
def get_db_session():
    return next(get_db())

# User and Auth Routes
@bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    db = get_db_session()
    try:
        data = request.get_json()
        validated_data = schemas.UserCreate(**data)
        hashed_password = generate_password_hash(validated_data.password)
        new_user = models.User(
            email=validated_data.email,
            name=validated_data.name,
            password_hash=hashed_password,
            is_admin=validated_data.is_admin
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return jsonify(schemas.User.from_orm(new_user).dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Registration failed: {str(e)}"}), 400
    finally:
        db.close()

@bp.route('/login', methods=['POST'])
def login():
    db = get_db_session()
    try:
        data = request.get_json()
        user = db.query(models.User).filter_by(email=data['email']).first()
        if user and check_password_hash(user.password_hash, data['password']):
            # NOTE: create_access_token would be imported from flask_jwt_extended
            # and configured in the main app factory.
            # For now, returning a simple success message.
            return jsonify({"message": "Login successful", "user": schemas.User.from_orm(user).dict()})
        return jsonify({"message": "Invalid credentials"}), 401
    finally:
        db.close()

# Team Routes
@bp.route('/teams', methods=['POST'])
@jwt_required()
def create_team():
    db = get_db_session()
    try:
        data = request.get_json()
        validated_data = schemas.TeamCreate(**data)
        team = models.Team(**validated_data.dict())
        db.add(team)
        db.commit()
        db.refresh(team)
        return jsonify(schemas.Team.from_orm(team).dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@bp.route('/teams', methods=['GET'])
@jwt_required()
def list_teams():
    db = get_db_session()
    try:
        teams = db.query(models.Team).all()
        return jsonify([schemas.Team.from_orm(t).dict() for t in teams])
    finally:
        db.close()

# Player Routes
@bp.route('/players', methods=['POST'])
@jwt_required()
def create_player():
    db = get_db_session()
    try:
        data = request.get_json()
        validated_data = schemas.PlayerCreate(**data)
        player = models.Player(**validated_data.dict())
        db.add(player)
        db.commit()
        db.refresh(player)
        return jsonify(schemas.Player.from_orm(player).dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@bp.route('/players', methods=['GET'])
@jwt_required()
def list_players():
    db = get_db_session()
    try:
        team_id = request.args.get('team_id')
        query = db.query(models.Player)
        if team_id:
            query = query.filter(models.Player.team_id == team_id)
        players = query.all()
        return jsonify([schemas.Player.from_orm(p).dict() for p in players])
    finally:
        db.close()

# Match Routes
@bp.route('/matches', methods=['POST'])
@jwt_required()
def create_match():
    db = get_db_session()
    try:
        data = request.get_json()
        validated_data = schemas.MatchCreate(**data)
        match = models.Match(**validated_data.dict())
        db.add(match)
        db.commit()
        db.refresh(match)
        return jsonify(schemas.Match.from_orm(match).dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@bp.route('/matches/<int:match_id>/like', methods=['POST'])
def like_match(match_id):
    db = get_db_session()
    try:
        match = db.query(models.Match).filter_by(id=match_id).first()
        if not match:
            return jsonify({"error": "Match not found"}), 404
        
        match.likes = (match.likes or 0) + 1
        db.commit()
        db.refresh(match)
        
        return jsonify({"id": match.id, "likes": match.likes})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@bp.route('/matches/<int:match_id>', methods=['GET'])
def get_match(match_id):
    db = get_db_session()
    try:
        match = db.query(models.Match).options(
            joinedload(models.Match.home_team),
            joinedload(models.Match.away_team)
        ).filter_by(id=match_id).first()

        if not match:
            return jsonify({"error": "Match not found"}), 404

        # Increment view count
        match.views = (match.views or 0) + 1
        db.commit()
        db.refresh(match)
        
        # Serialize manually
        match_dict = {
            "id": match.id,
            "title": match.title,
            "date": match.date.isoformat() if match.date else None,
            "venue": match.venue,
            "video_path": match.video_path,
            "notes": match.notes,
            "likes": match.likes,
            "views": match.views,
            "home_team_id": match.home_team_id,
            "away_team_id": match.away_team_id,
            "home_team": None,
            "away_team": None
        }
        if match.home_team:
            match_dict["home_team"] = {
                "id": match.home_team.id,
                "name": match.home_team.name,
                "coach": match.home_team.coach,
                "logo_url": match.home_team.logo_url
            }
        if match.away_team:
            match_dict["away_team"] = {
                "id": match.away_team.id,
                "name": match.away_team.name,
                "coach": match.away_team.coach,
                "logo_url": match.away_team.logo_url
            }

        return jsonify(match_dict)
    except Exception as e:
        db.rollback()
        import traceback
        logging.error(f"A critical error occurred in get_match: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred."}), 500
    finally:
        db.close()

import logging

# ... (rest of the imports)

bp = Blueprint('api', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# ... (rest of the code)

@bp.route('/matches', methods=['GET'])
# @jwt_required()
def list_matches():
    logging.info("Attempting to list matches.")
    db = get_db_session()
    try:
        logging.info("Querying database for matches.")
        matches = db.query(models.Match).options(
            joinedload(models.Match.home_team),
            joinedload(models.Match.away_team)
        ).order_by(models.Match.date.desc()).all()
        logging.info(f"Successfully fetched {len(matches)} matches from the database.")
        
        result_list = []
        for m in matches:
            match_dict = {
                "id": m.id,
                "title": m.title,
                "date": m.date.isoformat() if m.date else None,
                "venue": m.venue,
                "video_path": m.video_path,
                "notes": m.notes,
                "likes": m.likes,
                "views": m.views,
                "home_team_id": m.home_team_id,
                "away_team_id": m.away_team_id,
                "home_team": None,
                "away_team": None
            }
            if m.home_team:
                match_dict["home_team"] = {
                    "id": m.home_team.id,
                    "name": m.home_team.name,
                    "coach": m.home_team.coach,
                    "logo_url": m.home_team.logo_url
                }
            if m.away_team:
                match_dict["away_team"] = {
                    "id": m.away_team.id,
                    "name": m.away_team.name,
                    "coach": m.away_team.coach,
                    "logo_url": m.away_team.logo_url
                }
            result_list.append(match_dict)
        
        logging.info("Successfully processed all matches.")
        return jsonify(result_list)
    except Exception as e:
        import traceback
        logging.error(f"A critical error occurred in list_matches: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred."}), 500
    finally:
        db.close()

# ... (rest of the code)


# Lineup Routes
@bp.route('/matches/<int:match_id>/lineup', methods=['POST'])
@jwt_required()
def add_player_to_lineup(match_id):
    db = get_db_session()
    try:
        data = request.get_json()
        # Add match_id from URL to the data
        data['match_id'] = match_id
        validated_data = schemas.MatchLineupCreate(**data)
        
        # Check if player is already in lineup
        existing = db.query(models.MatchLineup).filter_by(
            match_id=validated_data.match_id,
            player_id=validated_data.player_id
        ).first()
        if existing:
            return jsonify({"error": "Player already in lineup for this match"}), 409

        lineup_entry = models.MatchLineup(**validated_data.dict())
        db.add(lineup_entry)
        db.commit()
        db.refresh(lineup_entry)
        return jsonify(schemas.MatchLineup.from_orm(lineup_entry).dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@bp.route('/matches/<int:match_id>/lineup', methods=['GET'])
@jwt_required()
def get_match_lineup(match_id):
    db = get_db_session()
    try:
        lineup = db.query(models.MatchLineup).options(
            joinedload(models.MatchLineup.player).joinedload(models.Player.team)
        ).filter(models.MatchLineup.match_id == match_id).all()
        return jsonify([schemas.MatchLineup.from_orm(l).dict() for l in lineup])
    finally:
        db.close()
        
# Event Routes
@bp.route('/matches/<int:match_id>/events', methods=['POST'])
@jwt_required()
def add_event_to_match(match_id):
    db = get_db_session()
    try:
        data = request.get_json()
        data['match_id'] = match_id
        validated_data = schemas.EventCreate(**data)
        event = models.Event(**validated_data.dict())
        db.add(event)
        db.commit()
        db.refresh(event)
        return jsonify(schemas.Event.from_orm(event).dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@bp.route('/matches/<int:match_id>/events', methods=['GET'])
@jwt_required()
def get_match_events(match_id):
    db = get_db_session()
    try:
        events = db.query(models.Event).options(
            joinedload(models.Event.player)
        ).filter(models.Event.match_id == match_id).all()
        return jsonify([schemas.Event.from_orm(e).dict() for e in events])
    finally:
        db.close()
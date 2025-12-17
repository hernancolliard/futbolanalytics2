from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import joinedload
import logging

from database import get_db
import models
import schemas

bp = Blueprint("api", __name__)

# ------------------------------------------------------------------
# Utils
# ------------------------------------------------------------------

def get_db_session():
    return next(get_db())

logging.basicConfig(level=logging.INFO)

# ------------------------------------------------------------------
# AUTH ROUTES
# ------------------------------------------------------------------

@bp.route("/register", methods=["POST"])
def register():
    db = get_db_session()
    try:
        data = request.get_json()
        validated = schemas.UserCreate(**data)

        hashed_password = generate_password_hash(validated.password)

        user = models.User(
            email=validated.email,
            name=validated.name,
            password_hash=hashed_password,
            is_admin=validated.is_admin
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return jsonify(schemas.User.from_orm(user).dict()), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@bp.route("/login", methods=["POST"])
def login():
    db = get_db_session()
    try:
        data = request.get_json()
        user = db.query(models.User).filter_by(email=data["email"]).first()

        if not user or not check_password_hash(user.password_hash, data["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": schemas.User.from_orm(user).dict()
        })

    finally:
        db.close()

# ------------------------------------------------------------------
# TEAMS
# ------------------------------------------------------------------

@bp.route("/teams", methods=["POST"])
@jwt_required()
def create_team():
    db = get_db_session()
    try:
        validated = schemas.TeamCreate(**request.get_json())
        team = models.Team(**validated.dict())

        db.add(team)
        db.commit()
        db.refresh(team)

        return jsonify(schemas.Team.from_orm(team).dict()), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@bp.route("/teams", methods=["GET"])
@jwt_required()
def list_teams():
    db = get_db_session()
    try:
        teams = db.query(models.Team).all()
        return jsonify([schemas.Team.from_orm(t).dict() for t in teams])
    finally:
        db.close()

# ------------------------------------------------------------------
# PLAYERS
# ------------------------------------------------------------------

@bp.route("/players", methods=["POST"])
@jwt_required()
def create_player():
    db = get_db_session()
    try:
        validated = schemas.PlayerCreate(**request.get_json())
        player = models.Player(**validated.dict())

        db.add(player)
        db.commit()
        db.refresh(player)

        return jsonify(schemas.Player.from_orm(player).dict()), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@bp.route("/players", methods=["GET"])
@jwt_required()
def list_players():
    db = get_db_session()
    try:
        team_id = request.args.get("team_id")
        query = db.query(models.Player)

        if team_id:
            query = query.filter(models.Player.team_id == team_id)

        players = query.all()
        return jsonify([schemas.Player.from_orm(p).dict() for p in players])

    finally:
        db.close()

# ------------------------------------------------------------------
# MATCHES
# ------------------------------------------------------------------

@bp.route("/matches", methods=["POST"])
@jwt_required()
def create_match():
    db = get_db_session()
    try:
        validated = schemas.MatchCreate(**request.get_json())
        match = models.Match(**validated.dict())

        db.add(match)
        db.commit()
        db.refresh(match)

        return jsonify(schemas.Match.from_orm(match).dict()), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@bp.route("/matches", methods=["GET"])
def list_matches():
    db = get_db_session()
    try:
        matches = (
            db.query(models.Match)
            .options(
                joinedload(models.Match.home_team),
                joinedload(models.Match.away_team)
            )
            .order_by(models.Match.date.desc())
            .all()
        )

        result = []
        for m in matches:
            result.append({
                "id": m.id,
                "title": m.title,
                "date": m.date.isoformat() if m.date else None,
                "venue": m.venue,
                "video_path": m.video_path,
                "notes": m.notes,
                "likes": m.likes,
                "views": m.views,
                "home_team": m.home_team and {
                    "id": m.home_team.id,
                    "name": m.home_team.name,
                    "coach": m.home_team.coach,
                    "logo_url": m.home_team.logo_url
                },
                "away_team": m.away_team and {
                    "id": m.away_team.id,
                    "name": m.away_team.name,
                    "coach": m.away_team.coach,
                    "logo_url": m.away_team.logo_url
                }
            })

        return jsonify(result)

    finally:
        db.close()


@bp.route("/matches/<int:match_id>", methods=["GET"])
def get_match(match_id):
    db = get_db_session()
    try:
        match = (
            db.query(models.Match)
            .options(
                joinedload(models.Match.home_team),
                joinedload(models.Match.away_team)
            )
            .filter_by(id=match_id)
            .first()
        )

        if not match:
            return jsonify({"error": "Match not found"}), 404

        match.views = (match.views or 0) + 1
        db.commit()

        return jsonify({
            "id": match.id,
            "title": match.title,
            "date": match.date.isoformat() if match.date else None,
            "venue": match.venue,
            "video_path": match.video_path,
            "notes": match.notes,
            "likes": match.likes,
            "views": match.views,
            "home_team": match.home_team and {
                "id": match.home_team.id,
                "name": match.home_team.name,
                "coach": match.home_team.coach,
                "logo_url": match.home_team.logo_url
            },
            "away_team": match.away_team and {
                "id": match.away_team.id,
                "name": match.away_team.name,
                "coach": match.away_team.coach,
                "logo_url": match.away_team.logo_url
            }
        })

    finally:
        db.close()

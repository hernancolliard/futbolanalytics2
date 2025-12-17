from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

# ------------------------------------------------------------------
# TEAM SCHEMAS
# ------------------------------------------------------------------

class TeamBase(BaseModel):
    name: str
    coach: Optional[str] = None
    logo_url: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class Team(TeamBase):
    id: int

    class Config:
        from_attributes = True


# ------------------------------------------------------------------
# PLAYER SCHEMAS
# ------------------------------------------------------------------

class PlayerBase(BaseModel):
    name: str
    position: Optional[str] = None
    date_of_birth: Optional[date] = None
    jersey_number: Optional[int] = None
    team_id: Optional[int] = None


class PlayerCreate(PlayerBase):
    pass


class Player(PlayerBase):
    id: int
    team: Optional[Team] = None

    class Config:
        from_attributes = True


# ------------------------------------------------------------------
# MATCH SCHEMAS
# ------------------------------------------------------------------

class MatchBase(BaseModel):
    title: str
    date: Optional[datetime] = None
    venue: Optional[str] = None
    video_path: Optional[str] = None
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None
    notes: Optional[str] = None


class MatchCreate(MatchBase):
    pass


class Match(MatchBase):
    id: int
    likes: int
    views: int
    home_team: Optional[Team] = None
    away_team: Optional[Team] = None

    class Config:
        from_attributes = True


# ------------------------------------------------------------------
# MATCH LINEUP SCHEMAS
# ------------------------------------------------------------------

class MatchLineupBase(BaseModel):
    match_id: int
    player_id: int
    team_id: int
    is_starter: bool = True


class MatchLineupCreate(MatchLineupBase):
    pass


class MatchLineup(MatchLineupBase):
    id: int
    player: Optional[Player] = None

    class Config:
        from_attributes = True


# ------------------------------------------------------------------
# EVENT SCHEMAS
# ------------------------------------------------------------------

class EventBase(BaseModel):
    match_id: int
    player_id: int
    event_type: str
    timestamp: float
    x: Optional[int] = None
    y: Optional[int] = None
    data: Optional[dict] = None


class EventCreate(EventBase):
    pass


class Event(EventBase):
    id: int
    player: Optional[Player] = None

    class Config:
        from_attributes = True


# ------------------------------------------------------------------
# USER SCHEMAS
# ------------------------------------------------------------------

class UserBase(BaseModel):
    email: str
    name: str
    is_admin: bool = False


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

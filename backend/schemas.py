from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

# Base and Create schemas should not include relationships
# The main schema (for reading) can include relationship data

# Team Schemas
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

# Player Schemas
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
    team: Optional[Team] = None # Include team data on read

    class Config:
        from_attributes = True

# Match Schemas
class MatchBase(BaseModel):
    title: str
    date: Optional[datetime] = None
    venue: Optional[str] = None
    video_path: Optional[str] = None
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None
    notes: Optional[str] = None
    likes: int = 0

class MatchCreate(MatchBase):
    pass

# When reading a Match, we might want to see the team objects
class Match(MatchBase):
    id: int
    home_team: Optional[Team] = None
    away_team: Optional[Team] = None
    
    class Config:
        from_attributes = True

# MatchLineup Schemas
class MatchLineupBase(BaseModel):
    match_id: int
    player_id: int
    team_id: int
    is_starter: bool = True

class MatchLineupCreate(MatchLineupBase):
    pass

class MatchLineup(MatchLineupBase):
    id: int
    player: Player # Show full player info in lineup

    class Config:
        from_attributes = True

# Event Schemas
class EventBase(BaseModel):
    match_id: int
    player_id: Optional[int] = None
    event_type: str
    timestamp: float
    x: Optional[int] = None
    y: Optional[int] = None
    data: Optional[dict] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    player: Optional[Player] = None # Show player info on read

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    is_admin: bool = False

class UserCreate(UserBase):

    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
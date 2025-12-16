from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Boolean, Text, REAL, DATE
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, backref
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(120))
    password_hash = Column(String(255))
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Team(Base):
    __tablename__ = 'teams'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    coach = Column(String(255))
    logo_url = Column(String(1024))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    players = relationship('Player', back_populates='team')
    home_matches = relationship('Match', back_populates='home_team')
    away_matches = relationship('Match', back_populates='away_team')

class Player(Base):
    __tablename__ = 'players'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id', ondelete='SET NULL'))
    position = Column(String(80))
    date_of_birth = Column(DATE)
    jersey_number = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    team = relationship('Team', back_populates='players')
    lineups = relationship('MatchLineup', back_populates='player')

class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    date = Column(DateTime(timezone=True))
    venue = Column(String(255))
    video_path = Column(String(1024))
    home_team_id = Column(Integer, ForeignKey('teams.id'))
    away_team_id = Column(Integer, ForeignKey('teams.id'))
    notes = Column(Text)
    likes = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    home_team = relationship('Team', foreign_keys=[home_team_id], back_populates='home_matches')
    away_team = relationship('Team', foreign_keys=[away_team_id], back_populates='away_matches')
    lineups = relationship('MatchLineup', back_populates='match', cascade='all, delete-orphan')
    events = relationship('Event', back_populates='match', cascade='all, delete-orphan')

class MatchLineup(Base):
    __tablename__ = 'match_lineups'
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey('matches.id', ondelete='CASCADE'), nullable=False)
    player_id = Column(Integer, ForeignKey('players.id', ondelete='CASCADE'), nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    is_starter = Column(Boolean, default=True)

    match = relationship('Match', back_populates='lineups')
    player = relationship('Player', back_populates='lineups')
    team = relationship('Team') # No back_populates needed if not navigating from team to lineups

class Event(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey('matches.id', ondelete='CASCADE'))
    player_id = Column(Integer, ForeignKey('players.id', ondelete='CASCADE'))
    event_type = Column(String(80))
    timestamp = Column(REAL)
    x = Column(Integer)
    y = Column(Integer)
    data = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    match = relationship('Match', back_populates='events')
    player = relationship('Player') # No back_populates needed if not navigating from player to events
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
class User(Base):
  __tablename__ = 'users'
  id = Column(Integer, primary_key=True, index=True)
  email = Column(String(255), unique=True, index=True, nullable=False)
  name = Column(String(120))
  password_hash = Column(String(255))
  is_admin = Column(Boolean, default=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
class Match(Base):
  __tablename__ = 'matches'
  id = Column(Integer, primary_key=True, index=True)
  title = Column(String(255))
  date = Column(DateTime)
  venue = Column(String(255))
  video_path = Column(String(1024))
  notes = Column(Text)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  events = relationship('Event', back_populates='match', cascade='all, delete')
class Event(Base):
  __tablename__ = 'events'
  id = Column(Integer, primary_key=True, index=True)
  match_id = Column(Integer, ForeignKey('matches.id'))
  event_type = Column(String(80)) # pass, shot, tackle, etc.
  minute = Column(Integer)
  x = Column(Integer) # optional pitch coordinates
  y = Column(Integer)
  metadata = Column(Text)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  match = relationship('Match', back_populates='events')

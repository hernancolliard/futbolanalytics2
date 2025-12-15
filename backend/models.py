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
  time = Column(String(10)) # MM:SS format
  player = Column(String(120))
  action = Column(String(80)) # pass, shot, tackle, etc.
  result = Column(String(20)) # success, fail, etc.
  x = Column(Integer, nullable=True)
  y = Column(Integer, nullable=True)
  meta_data = Column("metadata", Text)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  match = relationship('Match', back_populates='events')

class CustomButton(Base):
  __tablename__ = 'custom_buttons'
  id = Column(Integer, primary_key=True, index=True)
  name = Column(String(80), nullable=False)
  color = Column(String(20), default='#FFFFFF')

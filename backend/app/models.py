from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from .database import Base

class User(Base):
    __tablename__ = "users"

    id=Column(Integer, primary_key=True, index=True)
    name=Column(String, nullable=False)
    email=Column(String, unique=True, nullable=False)
    hashed_password=Column(String, nullable=False)

class Documents(Base):
    __tablename__ = "documents"
    id=Column(Integer,primary_key=True, index=True)
    title=Column(String, nullable=False)
    filename=Column(String)
    file_type=Column(String)
    file_path=Column(String)
    size=Column(Integer)
    upload_date=Column(DateTime)
    status=Column(String)
    user_id=Column(Integer,ForeignKey("users.id"))
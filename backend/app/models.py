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
    pages = Column(Integer)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True)
    role = Column(String)
    content = Column(String)
    created_at = Column(DateTime)
    document_id = Column(Integer, ForeignKey("documents.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
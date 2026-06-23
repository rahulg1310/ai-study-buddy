from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import SignUpRequest
from app.models import User
from app.database import get_db
from app.auth import hash_password

router = APIRouter();

@router.post("/signup")
def signup(user : SignUpRequest , db : Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return{
            "message": "Email already exists"
        }
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message" : "User created successfully",
        "id" : new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }
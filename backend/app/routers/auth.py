from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import SignUpRequest
from app.schemas import SignInRequest
from app.schemas import GoogleSignInRequest
from app.models import User
from app.database import get_db
from app.auth import ( hash_password, verify_password, create_access_token , get_google_user )

router = APIRouter();

@router.post("/signup")
def signup(user : SignUpRequest , db : Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
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

@router.post('/signin')
def signin(user : SignInRequest , db : Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(
        user.password,
        existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )
    
    token=create_access_token(existing_user.id)
    return{
        "message": "Login successful",
        "token": token,
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email
        }
    }

@router.post('/google-signin')
def google_signin(user : GoogleSignInRequest, db : Session = Depends(get_db)):
    
    google_user=get_google_user(user.credentials)
    
    existing_user=db.query(User).filter(User.email==google_user["email"]).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="Email not found")
    token=create_access_token(existing_user.id)
    return{
        "message": "Google login successful",
        "token": token,
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email
        }
    }


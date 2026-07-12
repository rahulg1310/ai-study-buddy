from passlib.context import CryptContext
from jose import jwt 
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2 import id_token
from fastapi.security import  OAuth2PasswordBearer
import requests
import os
from jose import JWTError

load_dotenv()

SECRET_KEY=os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
GOOGLE_CLIENT_ID=os.getenv("GOOGLE_CLIENT_ID")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="signin")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)

def create_access_token(user_id : int):
    payload = {
        "user_id" : user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def get_google_user(access_token : str):
    response = requests.get("https://www.googleapis.com/oauth2/v3/userinfo",
                            headers={
                                "Authorization" : f"Bearer {access_token}"
                            }
                        )
    if response.status_code!=200:
        return None
    return response.json()

def decode_access_token(token : str):
    try:
        return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
        )
    except JWTError as e:
        print("JWT ERROR:", e)
        return None

    
    
from passlib.context import CryptContext
from jose import jwt 
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY=os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

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
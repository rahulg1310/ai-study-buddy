from pydantic import BaseModel

class SignUpRequest(BaseModel):
    name : str
    email : str
    password : str

class SignInRequest(BaseModel):
    email : str
    password : str

class GoogleSignInRequest(BaseModel):
    credentials : str

class ChatRequest(BaseModel):
    message: str

class FlashcardRequest(BaseModel):
    existing_questions: list[str] = []

class QuizRequest(BaseModel):
    existing_questions: list[str] = []
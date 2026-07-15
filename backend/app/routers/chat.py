from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import ChatMessage
from app.database import get_db
from app.auth import oauth2_scheme, decode_access_token
from app.models import Documents
from app.schemas import ChatRequest
from app.ai.chat import ask_question

router = APIRouter()


@router.post("/documents/{document_id}/chat")
def chat(
    document_id: int,
    request: ChatRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
    ):
    details = decode_access_token(token)
    user_id = details["user_id"]

    document = (
        db.query(Documents)
        .filter(
            Documents.id == document_id,
            Documents.user_id == user_id
        )
        .first()
    )
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    answer = ask_question(
        request.message,
        document_id
    )
    user_message = ChatMessage(
        role="user",
        content=request.message,
        document_id=document_id,
        user_id=user_id
    )
    db.add(user_message)

    assistant_message = ChatMessage(
        role="assistant",
        content=answer,
        document_id=document_id,
        user_id=user_id
    )
    db.add(assistant_message)
    db.commit()
    return {
        "answer": answer
    }

@router.get("/documents/{document_id}/chat")
def get_chat(
    document_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
    ):
    details = decode_access_token(token)
    user_id = details["user_id"]
    document = (
        db.query(Documents)
        .filter(
            Documents.id == document_id,
            Documents.user_id == user_id
        )
        .first()
    )
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.document_id == document_id,
            ChatMessage.user_id == user_id
        )
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return [
        {
            "id": message.id,
            "role": message.role,
            "content": message.content,
            "created_at": message.created_at
        }
        for message in messages
    ]
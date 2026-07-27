from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Documents
from app.ai.ingest import load_document
from app.ai.chat import generate_flashcards
from app.database import get_db
from app.schemas import FlashcardRequest


router = APIRouter()

@router.post("/documents/{document_id}/flashcards")
def generate(document_id : int, request : FlashcardRequest, db : Session = Depends(get_db)):
    document = db.query(Documents).filter(Documents.id==document_id).first()
    if not document:
        raise HTTPException(status_code=404,detail="Document not found")
    docs = load_document(document.file_path)
    text = "\n".join(
        doc.page_content
        for doc in docs
    )
    flashcards = generate_flashcards(text,request.existing_questions)
    return flashcards
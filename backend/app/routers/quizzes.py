from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Documents, Quiz
from app.ai.ingest import load_document
from app.ai.chat import generate_quiz
from app.database import get_db

router = APIRouter()

@router.get("/documents/{document_id}/quizzes")
def get_quizzes(document_id : int, db : Session = Depends(get_db)):
    document = db.query(Documents).filter(Documents.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    quizzes = db.query(Quiz).filter(Quiz.document_id == document_id).order_by(Quiz.id.asc()).all()
    return quizzes

@router.post("/documents/{document_id}/quizzes")
def generate(document_id : int, db : Session = Depends(get_db)):
    document = db.query(Documents).filter(Documents.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    existing_quizzes = db.query(Quiz).filter(Quiz.document_id == document_id).all()
    existing_questions = []
    for qz in existing_quizzes:
        if qz.questions:
            for item in qz.questions:
                if isinstance(item, dict) and "question" in item:
                    existing_questions.append(item["question"])

    docs = load_document(document.file_path)
    text = "\n".join(
        doc.page_content
        for doc in docs
    )
    questions = generate_quiz(text, existing_questions)

    count = len(existing_quizzes) + 1
    quiz_title = f"{document.title} — Quick Check" if count == 1 else "Generated Quiz"

    new_quiz = Quiz(
        title=quiz_title,
        questions=questions,
        document_id=document_id,
        user_id=document.user_id
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)
    return new_quiz

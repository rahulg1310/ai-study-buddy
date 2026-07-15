import os
from app.ai.ingest import load_pdf, split_documents
from app.ai.vector_store import vector_store
from app.utils.file import save_file
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Documents
from app.models import User
from app.database import get_db
from fastapi import File, UploadFile
from datetime import date, datetime
from app.auth import oauth2_scheme, decode_access_token
from app.models import ChatMessage

router = APIRouter()

@router.post("/documents")
def add(file: UploadFile=File(...),token : str = Depends(oauth2_scheme),db : Session = Depends(get_db)):
    details=decode_access_token(token)
    user_id=details["user_id"]
    existing_user=db.query(User).filter(User.id==user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404,detail="User not found")
    existing_file=db.query(Documents).filter(Documents.filename==file.filename , Documents.user_id==user_id).first()
    if existing_file:
        raise HTTPException(status_code=400,detail="File already exists. Please upload a new file")
    file_path = save_file(file)
    fsize = os.path.getsize(file_path)
    new_file=Documents(
        title=file.filename,
        filename=file.filename,
        file_type=file.content_type,
        file_path=file_path,
        size=fsize,
        upload_date=datetime.now(),
        status="Processing",
        user_id=details["user_id"]
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    documents = load_pdf(file_path)
    chunks = split_documents(documents)
    for chunk in chunks:
        chunk.metadata["document_id"]=new_file.id
        chunk.metadata["user_id"]=user_id
        chunk.metadata["filename"] = new_file.filename
    vector_store.add_documents(chunks)
    new_file.status="Uploaded"
    db.commit()
    db.refresh(new_file)
    return{
        "id": new_file.id,
        "title": new_file.title,
        "filename": new_file.filename,
        "file_type": new_file.file_type,
        "size": new_file.size,
        "status": new_file.status,
    }

@router.get("/documents")
def get(token : str = Depends(oauth2_scheme),db : Session = Depends(get_db)):
    print("TOKEN : ",token)
    details=decode_access_token(token)
    print("DETAILS : ", details)
    user_id=details["user_id"]
    existing_user=db.query(User).filter(User.id==user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404,detail="User not found")
    files=db.query(Documents).filter(Documents.user_id==user_id).all()
    return{
        "documents" : [
            {
                "id":file.id,
                "title":file.title,
                "filename":file.filename,
                "file_type":file.file_type,
                "size":file.size,
                "status":file.status
            }
            for file in files
        ]
    }

@router.delete("/documents/{document_id}")
def delete(document_id : int, token : str = Depends(oauth2_scheme), db : Session = Depends(get_db)):
    details = decode_access_token(token)
    user_id = details["user_id"]
    existing_user=db.query(User).filter(User.id==user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404,detail="User not found")
    existing_file=db.query(Documents).filter(Documents.id==document_id , Documents.user_id==user_id).first()
    if not existing_file:
        raise HTTPException(status_code=404,detail="File not found")
    db.query(ChatMessage).filter(
    ChatMessage.document_id == document_id
    ).delete()
    db.delete(existing_file)
    db.commit()
    return {
        "message": "Document deleted successfully"
    }
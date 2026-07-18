import os
from app.ai.ingest import load_document, split_documents
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
from app.ai.ingest import load_document, split_documents
import uuid

router = APIRouter()

@router.post("/documents")
def add(file: UploadFile=File(...),token : str = Depends(oauth2_scheme),db : Session = Depends(get_db)):
    details=decode_access_token(token)
    user_id=details["user_id"]
    existing_user=db.query(User).filter(User.id==user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404,detail="User not found")
    MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB
    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds 25 MB."
        )
    file.file.seek(0)
    saved_file = save_file(file)
    file_path = saved_file["file_path"]
    fsize = os.path.getsize(file_path)
    new_file=Documents(
        title=file.filename,
        filename=file.filename,
        file_type=file.content_type,
        file_path=file_path,
        size=fsize,
        upload_date=datetime.now(),
        status="Processing",
        user_id=details["user_id"],
        pages=0

    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    try:
        documents = load_document(file_path)
        pages = len(documents)
        chunks = split_documents(documents)
        chunk_ids=[]
        for chunk in chunks:
            chunk_id=str(uuid.uuid4())
            chunk.metadata["chunk_id"] = chunk_id
            chunk.metadata["document_id"] = new_file.id
            chunk.metadata["user_id"] = user_id
            chunk.metadata["filename"] = new_file.filename
            chunk_ids.append(chunk_id)
        vector_store.add_documents(documents=chunks,ids=chunk_ids)
        new_file.status="Uploaded"
        new_file.pages=pages
        new_file.chunk_ids = chunk_ids
        db.commit()
        db.refresh(new_file)
        return{
            "id": new_file.id,
            "title": new_file.title,
            "filename": new_file.filename,
            "file_type": new_file.file_type,
            "size": new_file.size,
            "status": new_file.status,
            "upload_date": new_file.upload_date,
            "pages": new_file.pages
        }
    except Exception as e:
        db.delete(new_file)
        db.commit()
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Unable to process document: {str(e)}"
        )
    

@router.get("/documents")
def get(token : str = Depends(oauth2_scheme),db : Session = Depends(get_db)):
    print("TOKEN : ",token)
    details=decode_access_token(token)
    print("DETAILS : ", details)
    user_id=details["user_id"]
    existing_user=db.query(User).filter(User.id==user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404,detail="User not found")
    files = (
    db.query(Documents)
    .filter(Documents.user_id == user_id)
    .order_by(
        Documents.upload_date.desc(),
        Documents.id.desc()
    )
    .all()
    )
    return{
        "documents" : [
            {
                "id":file.id,
                "title":file.title,
                "filename":file.filename,
                "file_type":file.file_type,
                "size":file.size,
                "status":file.status,
                "upload_date": file.upload_date,
                "pages": file.pages
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
    if existing_file.chunk_ids:
        vector_store.delete(
            ids=existing_file.chunk_ids
        )
    if os.path.exists(existing_file.file_path):
        os.remove(existing_file.file_path)
    db.delete(existing_file)
    db.commit()
    return {
        "message": "Document deleted successfully"
    }
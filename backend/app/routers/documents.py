from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Documents
from app.models import User
from app.database import get_db
from fastapi import File, UploadFile
from datetime import date, datetime
from app.auth import oauth2_scheme, decode_access_token

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
    contents=file.file.read()
    fsize=len(contents)
    new_file=Documents(
        title=file.filename,
        filename=file.filename,
        file_type=file.content_type,
        size=fsize,
        upload_date=datetime.now(),
        status="Uploaded",
        user_id=details["user_id"]
    )
    db.add(new_file)
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
    db.delete(existing_file)
    db.commit()
    return {
        "message": "Document deleted successfully"
    }
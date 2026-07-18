import os
import shutil
import uuid

UPLOAD_FOLDER = "uploads"

def save_file(file):
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{extension}"
    file_path=f"{UPLOAD_FOLDER}/{unique_filename}"

    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {
        "file_path": file_path,
        "stored_filename": unique_filename,
        "original_filename": file.filename
    }
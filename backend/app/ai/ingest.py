import os
from fastapi import HTTPException
from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    TextLoader,
)

from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_document(file_path):
    extension = os.path.splitext(file_path)[1].lower()
    if extension == ".pdf":
        loader = PyPDFLoader(file_path)
    elif extension == ".docx":
        loader = Docx2txtLoader(file_path)
    elif extension == ".txt":
        loader = TextLoader(file_path)
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )
    return loader.load()

def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=300
    )
    return splitter.split_documents(documents)
from langchain_chroma import Chroma
from app.ai.embed import embeddings

vector_store=Chroma(
    collection_name="documents",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)
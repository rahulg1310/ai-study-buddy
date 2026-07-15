from app.ai.vector_store import vector_store

vector_store.add_texts(
    [
        "Python is a programming language.",
        "Java is used for backend development.",
        "Cats are animals."
    ]
)

print("Stored successfully")
from app.ai.vector_store import vector_store

def retrieve_chunks(question, document_id):
    results = vector_store.similarity_search(
        question,
        k=5,
        filter={
            "document_id": document_id
        }
    )

    return results
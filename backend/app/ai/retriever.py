from app.ai.vector_store import vector_store

def retrieve_chunks(question, document_id):
    retriever = vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 5,
            "fetch_k": 10,
            "filter": {
                "document_id": document_id
            }
        }
    )

    return retriever.invoke(question)
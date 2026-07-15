from app.ai.vector_store import vector_store

results = vector_store.similarity_search(
    "What language is used for backend development?",
    k=1
)

for doc in results:
    print(doc.page_content)
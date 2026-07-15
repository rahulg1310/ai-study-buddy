from app.ai.retriever import retrieve_chunks

docs = retrieve_chunks(
    "What is Rahul's CGPA?",
    document_id=6
)

for doc in docs:
    print(doc.page_content)
    print(doc.metadata)
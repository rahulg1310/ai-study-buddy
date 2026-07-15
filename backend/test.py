from app.ai.ingest import load_pdf, split_documents

docs = load_pdf("uploads/RahulGanesan_Resume.pdf")

chunks = split_documents(docs)

print(len(docs))
print(len(chunks))

print(chunks[0])
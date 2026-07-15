from app.ai.embed import embeddings

vector = embeddings.embed_query("Python is a programming language.")

print(len(vector))
print(vector[:10])
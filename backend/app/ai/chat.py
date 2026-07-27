from app.ai.retriever import retrieve_chunks
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def ask_question(question, document_id, history):
    docs = retrieve_chunks(question, document_id)

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    conversation = "\n".join(
    f"{msg.role.capitalize()}: {msg.content}"
    for msg in history
)

    prompt = f"""
    You are Grace, an AI Study Buddy.

    Your job is to help students understand their study material.

    Use ONLY the information from the context when answering factual questions.

    If the user asks for an explanation,
    teach the concept in simple English with examples.

    If the user asks for a summary,
    summarize.

    If the user asks for a quiz,
    generate quiz questions.

    If the answer does not exist in the context,
    say you couldn't find it.

    Format your response using Markdown.

    Use:

    # Headings

    ## Subheadings

    - Bullet points

    **Bold** important words.

    Never write one huge paragraph.

    Keep answers concise unless the user explicitly asks for a detailed explanation.

    Use the conversation history to understand follow-up questions
    and references like "it", "that", or "this".

    Context:
    {context}

    Conversation History:
    {conversation}

    Question:
    {question}
    """

    response = llm.invoke(prompt)
    return response.text

def generate_flashcards(text):
    prompt = f"""
    You are Grace, an AI Study Buddy.

    Generate EXACTLY 3 flashcards from the study material below.

    Rules:
    - Return ONLY valid JSON.
    - Do NOT wrap the JSON in ```json.
    - Do NOT explain anything.
    - Every flashcard must have:
        - question
        - answer
    - Questions should test important concepts.
    - Answers should be concise.

    Example format:

    [
        {{
            "question": "What is TCP?",
            "answer": "Transmission Control Protocol"
        }},
        {{
            "question": "What is UDP?",
            "answer": "User Datagram Protocol"
        }},
        {{
            "question": "Which layer does HTTP belong to?",
            "answer": "Application Layer"
        }}
    ]

    Study Material:

    {text}
    """

    response = llm.invoke(prompt)

    cleaned = (
    response.text
    .replace("```json", "")
    .replace("```", "")
    .strip()
    )

    return json.loads(cleaned)
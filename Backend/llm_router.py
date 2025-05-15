# llm_router.py

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_groq import ChatGroq

router = APIRouter()

# Load context once at startup
_context_path = 'output.txt'
if os.path.exists(_context_path):
    with open(_context_path, 'r', encoding='utf-8') as f:
        data = f.read()
else:
    data = ""

def get_llm():
    """
    Returns the language model instance (LLM) using ChatGroq API.
    Reads the API key from the GROQ_API_KEY environment variable.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("Environment variable GROQ_API_KEY is not set")
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        max_tokens=1024,
        api_key=api_key
    )

llm = get_llm()

class QueryRequest(BaseModel):
    query: str

@router.post("/ask")
async def ask_query(request: QueryRequest):
    prompt = f"""You are EduLearnAI. A useful Assistant which helps people answer queries related to the Comsats University Islamabad Attock campus.
Using the provided context. If you don't know the answer, just say you don't know—don't hallucinate.
context:
{data}

question: {request.query}

answer:
"""
    ans = llm.invoke(prompt)
    return {"response": ans.content}

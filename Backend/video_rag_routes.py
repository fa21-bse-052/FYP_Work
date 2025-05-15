# video_rag_routes.py

import os
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain_core.prompts import ChatPromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from google import genai
from google.genai import types

router = APIRouter()

# ——— Helpers ——————————————————————————————————————————————

def init_google_client():
    api_key = os.getenv("GOOGLE_API_KEY", "")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY must be set")
    return genai.Client(api_key=api_key)

def get_llm():
    api_key = os.getenv("CHATGROQ_API_KEY", "")
    if not api_key:
        raise ValueError("CHATGROQ_API_KEY must be set")
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        max_tokens=1024,
        api_key=api_key,
    )

def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

# Simple prompt template for RAG
quiz_prompt = """
You are an assistant specialized in answering questions based on the provided context.
If the context does not contain the answer, reply “I don't know.”
Context:
{context}

Question:
{question}

Answer:
"""
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", quiz_prompt),
    ("human", "{question}"),
])

def create_chain(retriever):
    return ConversationalRetrievalChain.from_llm(
        llm=get_llm(),
        retriever=retriever,
        return_source_documents=True,
        chain_type="stuff",
        combine_docs_chain_kwargs={"prompt": chat_prompt},
        verbose=False,
    )

# In-memory session store
sessions: dict[str, dict] = {}

def process_transcription(text: str) -> str:
    # split → embed → index → store retriever & empty history
    splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=20)
    chunks = splitter.split_text(text)
    vs = FAISS.from_texts(chunks, get_embeddings())
    retr = vs.as_retriever(search_kwargs={"k": 3})
    sid = str(uuid.uuid4())
    sessions[sid] = {"retriever": retr, "history": []}
    return sid

# ——— Endpoints ———————————————————————————————————————————

class URLIn(BaseModel):
    youtube_url: str

@router.post("/transcribe_video")
async def transcribe_url(body: URLIn):
    client = init_google_client()
    try:
        resp = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=types.Content(parts=[
                types.Part(text="Transcribe the video"),
                types.Part(file_data=types.FileData(file_uri=body.youtube_url))
            ])
        )
        txt = resp.candidates[0].content.parts[0].text
        sid = process_transcription(txt)
        return {"session_id": sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload_video")
async def upload_file(
    file: UploadFile = File(...),
    prompt: str = "Transcribe the video",
):
    data = await file.read()
    client = init_google_client()
    try:
        resp = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=types.Content(parts=[
                types.Part(text=prompt),
                types.Part(inline_data=types.Blob(data=data, mime_type=file.content_type))
            ])
        )
        txt = resp.candidates[0].content.parts[0].text
        sid = process_transcription(txt)
        return {"session_id": sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class QueryIn(BaseModel):
    session_id: str
    query: str

@router.post("/vid_query")
async def query_rag(body: QueryIn):
    sess = sessions.get(body.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    chain = create_chain(sess["retriever"])
    result = chain.invoke({
        "question": body.query,
        "chat_history": sess["history"]
    })
    answer = result.get("answer", "I don't know.")
    # update history
    sess["history"].append((body.query, answer))
    # collect source snippets
    docs = result.get("source_documents") or []
    srcs = [getattr(d, "page_content", str(d)) for d in docs]
    return {"answer": answer, "source_documents": srcs}

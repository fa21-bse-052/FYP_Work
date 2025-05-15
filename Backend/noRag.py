# noRag.py

import uuid
from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
from pymongo import MongoClient
from config import CONNECTION_STRING, CHATGROQ_API_KEY, CUSTOM_PROMPT

router = APIRouter(prefix="/norag", tags=["noRag"])

# clients
client = Groq(api_key=CHATGROQ_API_KEY)
mongo = MongoClient(CONNECTION_STRING)
db = mongo["edulearnai"]
chats = db["chats"]

SYSTEM_PROMPT = "You are a helpful assistant which helps people in their tasks."


class ChatRequest(BaseModel):
    session_id: str
    question: str


@router.post("/session", summary="Create a new chat session")
async def create_session():
    session_id = str(uuid.uuid4())
    chats.insert_one({"session_id": session_id, "history": [], "summary": ""})
    return {"session_id": session_id}


@router.post("/chat", summary="Send a question to the assistant")
async def chat_endpoint(req: ChatRequest):
    doc = chats.find_one({"session_id": req.session_id})
    if not doc:
        # if session not exist, create it
        doc = {"session_id": req.session_id, "history": [], "summary": ""}
        chats.insert_one(doc)

    history, summary = doc["history"], doc["summary"]

    # auto-summarize if too many turns
    if len(history) >= 10:
        msgs = [f"{m['role']}: {m['content']}" for m in history]
        combined = summary + "\n" + "\n".join(msgs)
        sum_prompt = (
            "Summarize the following chat history in one or two short sentences:\n\n"
            + combined
            + "\n\nSummary:"
        )
        sum_resp = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{"role": "user", "content": sum_prompt}],
            temperature=0.3,
            max_completion_tokens=150,
            top_p=1,
            stream=False,
        )
        summary = sum_resp.choices[0].message.content.strip()
        history = []

    # build full prompt
    hist_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
    full_prompt = CUSTOM_PROMPT.format(
        context=SYSTEM_PROMPT,
        chat_history=hist_text or "(no prior messages)",
        question=req.question,
    )

    # get answer
    resp = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[{"role": "user", "content": full_prompt}],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
    )
    answer = resp.choices[0].message.content.strip()

    # persist
    history.append({"role": "user", "content": req.question})
    history.append({"role": "assistant", "content": answer})
    chats.replace_one(
        {"session_id": req.session_id},
        {"session_id": req.session_id, "history": history, "summary": summary},
        upsert=True,
    )

    return {"session_id": req.session_id, "answer": answer, "summary": summary}

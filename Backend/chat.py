# routes/chat.py
import uuid
from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import StreamingResponse
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory

import config
from models import ChatIDOut, MessageIn

router = APIRouter(prefix="/chat", tags=["chat"])

# ─── LLM & Prompt Setup ──────────────────────────────────────────────────────
def get_llm() -> ChatGroq:
    if not config.CHATGROQ_API_KEY:
        raise RuntimeError("CHATGROQ_API_KEY not set in environment")
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        max_tokens=1024,
        api_key=config.CHATGROQ_API_KEY
    )

llm = get_llm()

SYSTEM_PROMPT = """
You are an assistant specialized in solving quizzes. Your goal is to provide accurate,
concise, and contextually relevant answers.
"""
qa_template = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        ("user", "{question}"),
    ]
)

# ─── MongoDB History Setup ───────────────────────────────────────────────────
chat_sessions: dict[str, MongoDBChatMessageHistory] = {}

def create_history(session_id: str) -> MongoDBChatMessageHistory:
    history = MongoDBChatMessageHistory(
        session_id=session_id,
        connection_string=config.CONNECTION_STRING,
        database_name="Education_chatbot",
        collection_name="chat_histories",
    )
    chat_sessions[session_id] = history
    return history

def get_history(session_id: str) -> MongoDBChatMessageHistory:
    history = chat_sessions.get(session_id)
    if not history:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return history

# ─── Summarization (to control token use) ────────────────────────────────────
def summarize_if_needed(history: MongoDBChatMessageHistory, threshold: int = 10):
    msgs = history.messages
    if len(msgs) <= threshold:
        return

    summarization_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You are a summarization assistant."),
            ("user",
                "Here is the chat history:\n\n{chat_history}\n\n"
                "Summarize the above chat messages into a single concise message with key details."
            ),
        ]
    )
    text_history = "\n".join(
        f"{'User' if m.type=='human' else 'Assistant'}: {m.content}"
        for m in msgs
    )
    summary_chain = summarization_prompt | llm
    summary = summary_chain.invoke({"chat_history": text_history})

    history.clear()
    history.add_ai_message(f"[Summary] {summary.content}")

# ─── Endpoints ──────────────────────────────────────────────────────────────

@router.post("", response_model=ChatIDOut)
async def create_chat():
    """
    Create a new chat session and return its ID.
    """
    session_id = str(uuid.uuid4())
    create_history(session_id)
    return ChatIDOut(chat_id=session_id)

@router.post("/{chat_id}/message")
async def post_message(
    chat_id: str = Path(..., description="The chat session ID"),
    payload: MessageIn = None
):
    """
    Send a question and stream back the assistant's answer.
    """
    history = get_history(chat_id)
    question = (payload and payload.question.strip()) or ""
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # Summarize old turns if too long
    summarize_if_needed(history)

    # Build conversation for the LLM
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in history.messages:
        role = "user" if msg.type == "human" else "assistant"
        messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": question})

    # Persist user turn
    history.add_user_message(question)

    async def stream_generator():
        full_response = ""
        # Pass messages list as positional 'input' to .stream()
        for chunk in llm.stream(messages):
            # 1) Try AIMessageChunk.content
            content = getattr(chunk, "content", None)
            # 2) Fallback to dict-based chunk
            if content is None and isinstance(chunk, dict):
                content = (
                    chunk.get("content")
                    or chunk.get("choices", [{}])[0]
                             .get("delta", {})
                             .get("content")
                )
            if not content:
                continue
            # Yield and accumulate
            yield content
            full_response += content

        # Save final AI message
        history.add_ai_message(full_response)

    return StreamingResponse(stream_generator(), media_type="text/plain")

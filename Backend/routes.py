import os
import shutil
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from models import InitializeBotResponse, NewChatResponse, QueryRequest, QueryResponse
from trainer_manager import get_trainer
from config import CUSTOM_PROMPT
from prompt_templates import PromptTemplates

router = APIRouter()
trainer = get_trainer()

@router.post("/initialize_bot", response_model=InitializeBotResponse)
def initialize_bot(prompt_type: str = Query(None)):
    """
    Initializes a new bot and returns its bot_id.
    Accepts an optional 'prompt_type' query parameter (provided by the frontend).
    """
    try:
        bot_id = trainer.initialize_bot_id()
        # Optionally, you might want to store the prompt_type with the bot record.
        return InitializeBotResponse(bot_id=bot_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload_document")
async def upload_document(bot_id: str = Form(...), file: UploadFile = File(...)):
    """
    Saves the uploaded file temporarily and adds it to the specified bot's knowledge base.
    """
    try:
        # Save the file to a temporary location.
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # Add the document using the temporary file path to the specified bot.
        trainer.add_document_from_path(tmp_path, bot_id)

        # Remove the temporary file.
        os.remove(tmp_path)
        return {"message": "Document uploaded and added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create_bot/{bot_id}")
def create_bot(bot_id: str, prompt_type: str = Query(None)):
    """
    Finalizes the creation (build) of the bot identified by bot_id.
    Uses the provided (or default) prompt_type to determine the custom prompt template.
    If no prompt_type is provided, it defaults to "quiz_solving".
    """
    try:
        if prompt_type is None:
            prompt_type = "quiz_solving"

        # Determine the appropriate prompt template.
        if prompt_type == "university":
            prompt_template = PromptTemplates.get_university_chatbot_prompt()
        elif prompt_type == "quiz_solving":
            prompt_template = PromptTemplates.get_quiz_solving_prompt()
        elif prompt_type == "assignment_solving":
            prompt_template = PromptTemplates.get_assignment_solving_prompt()
        elif prompt_type == "paper_solving":
            prompt_template = PromptTemplates.get_paper_solving_prompt()
        elif prompt_type == "quiz_creation":
            prompt_template = PromptTemplates.get_quiz_creation_prompt()
        elif prompt_type == "assignment_creation":
            prompt_template = PromptTemplates.get_assignment_creation_prompt()
        elif prompt_type == "paper_creation":
            prompt_template = PromptTemplates.get_paper_creation_prompt()
        elif prompt_type == "check_quiz":
            prompt_template = PromptTemplates.get_check_quiz_prompt()
        elif prompt_type == "check_assignment":
            prompt_template = PromptTemplates.get_check_assignment_prompt()
        elif prompt_type == "check_paper":
            prompt_template = PromptTemplates.get_check_paper_prompt()
        else:
            prompt_template = PromptTemplates.get_quiz_solving_prompt()

        # Create (build) the bot using the specified bot_id and prompt template.
        trainer.create_bot(bot_id, prompt_template)
        return {"message": f"Bot {bot_id} created successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/new_chat/{bot_id}", response_model=NewChatResponse)
def new_chat(bot_id: str):
    """
    Creates a new chat session for the specified bot.
    """
    try:
        chat_id = trainer.new_chat(bot_id)
        return NewChatResponse(chat_id=chat_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/query", response_model=QueryResponse)
def send_query(query_request: QueryRequest):
    """
    Processes a query and returns the bot's response along with any web sources.
    The request must include bot_id, chat_id, and the query text.
    """
    try:
        response, web_sources = trainer.get_response(
            query_request.query, query_request.bot_id, query_request.chat_id
        )
        return QueryResponse(response=response, web_sources=web_sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list_chats/{bot_id}")
def list_chats(bot_id: str):
    """
    Returns a list of previous chat sessions for the specified bot.
    """
    try:
        chats = trainer.list_chats(bot_id)
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chat_history/{chat_id}")
def chat_history(chat_id: str, bot_id: str = Query(None)):
    """
    Returns the chat history for a given chat session.
    The bot_id can be provided as a query parameter (if needed).
    ObjectId instances in the history are converted to strings.
    """
    try:
        history = trainer.get_chat_by_id(chat_id=chat_id)
        return jsonable_encoder(history, custom_encoder={ObjectId: str})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

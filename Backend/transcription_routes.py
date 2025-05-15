# transcription_routes.py

import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from groq import Groq

router = APIRouter(prefix="/transcribe", tags=["transcription"])

# Load your Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

client = Groq(api_key=GROQ_API_KEY)

@router.post(
    "/audio",
    summary="Upload an audio file and return its transcription",
    response_description="Returns transcribed text as JSON"
)
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Only allow common audio formats
    allowed_exts = (".mp3", ".wav", ".m4a", ".flac")
    if not file.filename.lower().endswith(allowed_exts):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_exts)}"
        )

    data = await file.read()
    try:
        resp = client.audio.transcriptions.create(
            file=(file.filename, data),
            model="whisper-large-v3",
            response_format="verbose_json",
        )
        # The client returns .text or, if dict-like, resp.get("text")
        transcript = getattr(resp, "text", None) or resp.get("text")
        if transcript is None:
            raise ValueError("No transcript returned by service")
    except Exception as e:
        # All errors return 502 with the exception message
        raise HTTPException(status_code=502, detail=f"Transcription service error: {e}")

    return JSONResponse(content={"transcript": transcript})

# main.py
from fastapi import FastAPI
from routes import router as trainer_router
from auth import router as auth_router
from extraction_routes import router as extraction_router
from transcription_routes import router as transcription_router
from video_rag_routes import router as video_rag_router
from contact import router as contact_router
from chat import router as chat_router
from check import router as check_router  
from noRag import router as norag_router
from llm_router import router as llm_router


app = FastAPI(
    title="EduLearnAI API"
)

# Include our chat routes
app.include_router(chat_router)
app.include_router(contact_router)  
app.include_router(video_rag_router)
app.include_router(trainer_router)
app.include_router(auth_router )
app.include_router(extraction_router)
app.include_router(transcription_router)  
app.include_router(check_router)
app.include_router(llm_router, prefix="/llm", tags=["EduLearnAI"])
app.include_router(norag_router)

# Health check endpoint
@app.get("/", summary="Health Check for EduLearnAI")
async def root():
    return {"status": "ok", "message": "EduLearnAI is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# extraction_routes.py
import os
import io
import time
import PIL.Image
from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from pdf2image import convert_from_bytes
from google import genai
from google.genai.errors import ClientError

router = APIRouter()

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY environment variable is not set")

client = genai.Client(api_key=API_KEY)

def extract_text_from_image(img):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    "Extract the text from the image. Do not write anything except the extracted content",
                    img,
                ]
            )
            return response.text
        except ClientError as e:
            error_code = e.args[0] if e.args and isinstance(e.args[0], int) else None
            if error_code == 429:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                else:
                    raise HTTPException(
                        status_code=503,
                        detail="API resource exhausted. Please try again later."
                    )
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error processing image: {str(e)}"
                )

@router.post("/upload", summary="Upload a PDF or image file", response_description="Returns extracted text as JSON")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_contents = await file.read()
    output_text = ""

    if file.filename.lower().endswith(".pdf"):
        try:
            images = convert_from_bytes(file_contents, dpi=200)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error converting PDF: {str(e)}")
        
        for idx, img in enumerate(images, start=1):
            page_text = extract_text_from_image(img)
            output_text += f"### Page {idx}\n\n{page_text}\n\n"
    else:
        try:
            img = PIL.Image.open(io.BytesIO(file_contents))
        except Exception as e:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")
        
        output_text += extract_text_from_image(img) + "\n\n"
    
    return JSONResponse(content={"extracted_text": output_text})

@router.get("/", summary="Health Check for Extraction")
async def root():
    return JSONResponse(content={"message": "Text Extraction API is up and running."})

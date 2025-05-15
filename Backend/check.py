# check.py

import os
import tempfile
import json
import numpy as np
import cv2
from PIL import Image
from pdf2image import convert_from_bytes
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from google import genai

router = APIRouter(prefix="/check", tags=["check"])

# GenAI client
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise Exception("GENAI_API_KEY not set in environment")
client = genai.Client(api_key=GENAI_API_KEY)

# Temp storage for results
TEMP_FOLDER = tempfile.gettempdir()
RESULT_FILE = os.path.join(TEMP_FOLDER, "result_cards.json")


def extract_json_from_output(output_str: str):
    start = output_str.find("{")
    end = output_str.rfind("}")
    if start == -1 or end == -1:
        return None
    try:
        return json.loads(output_str[start : end + 1])
    except json.JSONDecodeError:
        return None


def parse_all_answers(image_input: Image.Image) -> str:
    output_format = """
Answer in the following JSON format. Do not write anything else:
{ "Answers": { "1": "<…>", …, "15": "<…>" } }
"""
    prompt = f"""
You are an assistant that extracts answers from an image of a 15-question sheet.
Provide ONLY JSON in this format:
{output_format}
"""
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=[prompt, image_input]
    )
    return response.text


def parse_info(image_input: Image.Image) -> str:
    output_format = """
Answer in the following JSON format. Do not write anything else:
{ "Candidate Info": { "Name": "<…>", "Number": "<…>", "Country": "<…>", "Level": "<…>", "Paper": "<…>" } }
"""
    prompt = f"""
You are an assistant that extracts candidate info from an image.
Provide ONLY JSON in this format:
{output_format}
"""
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=[prompt, image_input]
    )
    return response.text


def calculate_result(student_answers: dict, correct_answers: dict) -> dict:
    student_all = (student_answers or {}).get("Answers", {})
    correct_all = (correct_answers or {}).get("Answers", {})
    total = 15
    marks = 0
    detailed = {}
    for q in map(str, range(1, total + 1)):
        stud = (student_all.get(q) or "").strip()
        corr = (correct_all.get(q) or "").strip()
        ok = stud == corr
        detailed[q] = {"Student": stud, "Correct": corr, "Result": "Correct" if ok else "Incorrect"}
        if ok:
            marks += 1
    return {"Total Marks": marks, "Total Questions": total, "Percentage": marks / total * 100, "Detailed Results": detailed}


def load_answer_key(pdf_bytes: bytes) -> dict:
    images = convert_from_bytes(pdf_bytes)
    last_page = images[-1]
    resp = parse_all_answers(last_page)
    return extract_json_from_output(resp)


@router.post("/process", summary="Grade student sheets (Paper K only)")
async def process_pdfs(
    student_pdf: UploadFile = File(..., description="Student sheets PDF"),
    paper_k_pdf: UploadFile = File(..., description="Answer key PDF for Paper K"),
):
    try:
        stud_bytes = await student_pdf.read()
        key_bytes = await paper_k_pdf.read()

        answer_key = load_answer_key(key_bytes)
        if answer_key is None:
            raise HTTPException(400, detail="Could not parse Paper K answer key.")

        student_pages = convert_from_bytes(stud_bytes)
        all_results = []

        for idx, page in enumerate(student_pages, start=1):
            # crop candidate-info
            cv = cv2.cvtColor(np.array(page), cv2.COLOR_RGB2BGR)
            h, w = cv.shape[:2]
            mask = np.zeros((h, w), dtype="uint8")
            top, bottom = int(h * 0.10), int(h * 0.75)
            cv2.rectangle(mask, (0, top), (w, h - bottom), 255, -1)
            crop = cv2.bitwise_and(cv, cv, mask=mask)
            coords = cv2.findNonZero(mask)
            if coords is None:
                continue
            x, y, mw, mh = cv2.boundingRect(coords)
            cand_img = Image.fromarray(cv2.cvtColor(crop[y : y + mh, x : x + mw], cv2.COLOR_BGR2RGB))

            # parse candidate info
            info_txt = parse_info(cand_img)
            candidate_info = extract_json_from_output(info_txt) or {}

            # parse student answers
            stud_txt = parse_all_answers(page)
            stud_answers = extract_json_from_output(stud_txt)
            if stud_answers is None:
                raise HTTPException(400, detail=f"Failed to parse answers on page {idx}.")

            # grade
            result = calculate_result(stud_answers, answer_key)

            all_results.append(
                {
                    "Student Index": idx,
                    "Candidate Info": candidate_info.get("Candidate Info", {}),
                    "Student Answers": stud_answers,
                    "Correct Answer Key": answer_key,
                    "Result": result,
                }
            )

        # write file
        with open(RESULT_FILE, "w", encoding="utf-8") as f:
            json.dump({"results": all_results}, f, indent=2)

        return JSONResponse(content={"results": all_results})

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, detail=str(e))


@router.get("/download", summary="Download latest grading results")
async def download_results():
    if not os.path.exists(RESULT_FILE):
        raise HTTPException(404, detail="No results available. Run /check/process first.")
    return StreamingResponse(
        open(RESULT_FILE, "rb"),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=result_cards.json"},
    )


@router.get("/health", summary="Health check")
async def health_check():
    return {"status": "healthy"}


@router.get("/version", summary="Service version")
async def version_check():
    return {"version": "1.0.0"}

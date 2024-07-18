from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import shutil
import os
import uvicorn
import algorithms
import json


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return "This is API for the system. Head over to /docs to access the endpoints"

@app.get("/count-vectorizer")
def run_count_vectorizer():
    resume_path = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/sample.pdf'
    job_description = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/job_description.txt'
    cv = algorithms.Algorithms(resume_path, job_description)
    response = cv.count_vectorizer()
    return {'Response': response}

@app.post("/upload")
async def upload_file(   
    resume: UploadFile = File(...),
    cover_letter: UploadFile = File(...),
    job_description: str = Form(...) ,
    behavioral_values: List[str] = Form(...)
):
    upload_folder = "data/"
    os.makedirs(upload_folder, exist_ok=True)

    resume_location = f"{upload_folder}{resume.filename}"
    cover_letter_location = f"{upload_folder}{cover_letter.filename}"

    with open(resume_location, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)
    
    with open(cover_letter_location, "wb") as buffer:
        shutil.copyfileobj(cover_letter.file, buffer)

    # Process behavioral values, which are sent as a JSON string
    behavioral_values_list = behavioral_values

    # Further processing can be done here
    print(f"Job Description: {job_description}")
    print(f"Behavioral Values: {behavioral_values_list}")

    return {"message": "Files uploaded successfully"}

@app.get('/summarize')
async def generate_summary():
    data = "dummy data"
    algo = algorithms.Algorithms()
    result = algo.generate_summary(data)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

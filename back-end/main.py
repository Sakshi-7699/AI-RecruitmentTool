from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil
import os
import uvicorn
import algorithms
import json
import helper
from datetime import datetime


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
    job_description: str = Form(...),
    behavioral_values: List[str] = Form(...)
):
    

    # Define upload folder
    upload_folder = "data/"
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique suffix for file names
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Set fixed names with unique suffix
    resume_filename = f"resume_{timestamp}.pdf"
    cover_letter_filename = f"cover_letter_{timestamp}.pdf"

    resume_location = os.path.join(upload_folder, resume_filename)
    cover_letter_location = os.path.join(upload_folder, cover_letter_filename)
    
    cover_letter.filename = cover_letter_filename
    resume.filename = resume_filename
    # Save resume file
    with open(resume_location, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)
    
    # Save cover letter file
    with open(cover_letter_location, "wb") as buffer:
        shutil.copyfileobj(cover_letter.file, buffer)

    # Process behavioral values
    behavioral_values_list = behavioral_values

    # Print details for logging
    print(f"Job Description: {job_description}")
    print(f"Behavioral Values: {behavioral_values_list}")

    # Ensure generate_summary is awaited if it's async
    algo = algorithms.Algorithms()
    cover_letter_preprocessed = helper.get_preprocessed_text(cover_letter_location)
    summary = algo.generate_summary(cover_letter_preprocessed)



    return {"cover_letter_summary": summary}

@app.post('/summarize')
async def generate_summary(cover_letter : UploadFile = File(...)):
    data = helper.get_preprocessed_text(cover_letter)
    algo = algorithms.Algorithms()
    result = algo.generate_summary(data)
    print(result)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

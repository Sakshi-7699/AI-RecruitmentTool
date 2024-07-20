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
from fastapi import FastAPI, File, UploadFile, Form
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List
import base64

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
    behavioral_values_list = eval(behavioral_values[0])

    # Print details for logging
    # print(f"Job Description: {job_description}")
    # print(f"Behavioral Values: {behavioral_values_list}")

    # Ensure generate_summary is awaited if it's async
    algo = algorithms.Algorithms()
    cover_letter_preprocessed = helper.get_preprocessed_text(cover_letter_location)
    summary = algo.generate_summary(cover_letter_preprocessed)

    behavioral_scores = algo.get_behavioural_scores(cover_letter_preprocessed,behavioral_values_list)
    resume_match = algo.count_vectorizer(resume_location, job_description)
    return {
            "cover_letter_summary": summary,
            "behavioral_scores" : behavioral_scores,
            "resume_match_score" : resume_match
            }

@app.post('/summarize')
async def generate_summary(cover_letter : UploadFile = File(...)):
    data = helper.get_preprocessed_text(cover_letter)
    algo = algorithms.Algorithms()
    result = algo.generate_summary(data)
    print(result)
    return result

# MongoDB connection
client = AsyncIOMotorClient('mongodb+srv://sakshi:NQD0MEmPWLj4tZwj@cluster0.8f27dcp.mongodb.net/')
db = client['AI-RECRUITMENT']
collection = db['CANDIDATES']

class Candidate(BaseModel):
    name: str
    resume: str  # Store as base64-encoded string
    cover_letter: str  # Store as base64-encoded string

@app.post("/add-candidate")
async def upload_candidate(
    name: str = Form(...),
    resume: UploadFile = File(...),
    cover_letter: UploadFile = File(...)
):
    resume_content = await resume.read()
    cover_letter_content = await cover_letter.read()

    resume_base64 = base64.b64encode(resume_content).decode('utf-8')
    cover_letter_base64 = base64.b64encode(cover_letter_content).decode('utf-8')

    candidate = Candidate(name=name, resume=resume_base64, cover_letter=cover_letter_base64)
    result = await collection.insert_one(candidate.dict())

    return {"message": "Candidate uploaded successfully", "candidate_id": str(result.inserted_id)}

@app.get("/candidates/", response_model=List[Candidate])
async def get_candidates():
    candidates = []
    async for candidate in collection.find():
        candidates.append(Candidate(**candidate))
    return candidates


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

from fastapi import FastAPI, File, Form, Response, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.encoders import jsonable_encoder
from typing import List
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
import base64
import shutil
import os
import uvicorn

import helper
import algorithms

class Candidate(BaseModel):
    candidate_id: str
    candidate_name: str
    email: str
    phone_number: str
    address: str
    experience: str
    resume: str
    cover_letter: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }


client = AsyncIOMotorClient('mongodb://localhost:27017/')
db = client['AI-RECRUITMENT']
collection = db['CANDIDATES']
job_collection = db['JOBS']
    

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

class JobIDRequest(BaseModel):
    jobId: int

@app.post("/compatibility-check-all")
async def run_check_for_all(jobid: JobIDRequest):
    job = await job_collection.find_one({'Job Id': jobid.jobId})
    
    job_description = job['Job Description']
    
    
    
    
    return {"result": "ok"}

@app.post("/upload")
async def upload_file(   
    resume: UploadFile = File(...),
    cover_letter: UploadFile = File(...),
    job_description: str = Form(...),
    behavioral_values: List[str] = Form(...)
):
    
    try :
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

        algo = algorithms.Algorithms()
        cover_letter_preprocessed = helper.get_preprocessed_text(cover_letter_location)
        summary = algo.generate_summary(cover_letter_preprocessed)

        behavioral_scores = algo.get_behavioural_scores(cover_letter_preprocessed,behavioral_values_list)
        resume_match = algo.count_vectorizer(resume_location, job_description)

        os.remove(resume_location)
        os.remove(cover_letter_location)
        return {
                "cover_letter_summary": summary,
                "behavioral_scores" : behavioral_scores,
                "resume_match_score" : resume_match
                }

    except Exception as e:

        os.remove(resume_location)
        os.remove(cover_letter_location)
        return {"error": str(e)}

@app.post('/summarize')
async def generate_summary(cover_letter : UploadFile = File(...)):
    data = helper.get_preprocessed_text(cover_letter)
    algo = algorithms.Algorithms()
    result = algo.generate_summary(data)
    print(result)
    return result


@app.post("/add-candidate")
async def upload_candidate(
    name: str = Form(...),
    email: str = Form(...),
    phone_number: str = Form(...),
    address: str = Form(...),
    experience: str = Form(...),
    resume: UploadFile = File(...),
    cover_letter: UploadFile = File(...)
):
    resume_content = await resume.read()
    cover_letter_content = await cover_letter.read()

    resume_base64 = base64.b64encode(resume_content).decode('utf-8')
    cover_letter_base64 = base64.b64encode(cover_letter_content).decode('utf-8')

    candidate = Candidate(
        candidate_id=str(ObjectId()),
        candidate_name=name,
        email=email,
        phone_number=phone_number,
        address=address,
        experience=experience,
        resume=resume_base64,
        cover_letter=cover_letter_base64
    )

    result = await collection.insert_one(jsonable_encoder(candidate))
    return {"message": "Candidate uploaded successfully", "candidate_id": str(result.inserted_id)}
@app.get("/candidates/")
async def get_candidates():
    candidates = []
    async for data in  collection.find({}, {"_id": 0}) :
        candidates.append(data)
    return candidates

@app.get("/candidate-profile/{id}")
async def get_candidate(id):
    candidates = []
   
    async for data in  collection.find({"id": int(id)}, {"_id": 0}) :
        candidates.append(data)
        
    return candidates

@app.get("/resume/{id}")
async def get_resume(id: str):
    candidate = await collection.find_one({"id": int(id)})
    print(candidate)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    

    return candidate['resume_html']
    
@app.get("/cover_letter/{id}")
async def get_cover_letter(id: str):
    candidate = await collection.find_one({"id": int(id)})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    cover_letter_data = base64.b64decode(candidate['cover_letter'])
    return Response(content=cover_letter_data, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename={candidate['name']}_cover_letter.pdf"
    })

@app.get("/jobs/{count}")
async def get_jobs(count):
    data = job_collection.find({},{"_id":0}).limit(int(count))
    jobs = []
    async for job in data :
        jobs.append(job)
    return  jobs
    



@app.post("/auth/login")
async def login(credentials : dict):
    
    return {"token": credentials["username"]}



if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

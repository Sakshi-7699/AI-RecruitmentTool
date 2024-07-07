from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, Form, UploadFile

import uvicorn

import algorithms


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
    cv =  algorithms.Algorithms(resume_path,job_description)
    response = cv.count_vectorizer()
    return { 'Response' : response }

@app.post("/count-vectorizer/")
async def upload_file(file: UploadFile = File(...), job_description: str = Form(...)):
        resume_path = file
        job_description = job_description
        cv =  algorithms.Algorithms(resume_path,job_description)
        response = cv.count_vectorizer()
        return { 'Response' : response }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

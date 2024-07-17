from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, Form, UploadFile

import uvicorn

import algorithms

from fastapi.responses import JSONResponse
import shutil
import os

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

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), description: str = Form(...)):
    # Save the uploaded file
    upload_folder = "data/"
    os.makedirs(upload_folder, exist_ok=True)
    file_location = f"{upload_folder}{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process the description
    print(f"Description: {description}")

    return JSONResponse(content={"filename": file.filename, "description": description})



@app.get('/summarize')
async def generate_summary() :
    data = "I am Jessica and I will share brownie w sakshi"
    algo = algorithms.Algorithms()
    result = algo.generate_summary(data)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

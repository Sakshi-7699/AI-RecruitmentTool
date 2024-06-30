from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    return {"Hello": "World"}


@app.get("/count-vectorizer")
def run_count_vectorizer():
    
    resume_path = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/sample.pdf'
    job_description = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/job_description.txt'
    cv =  algorithms.Algorithms(resume_path,job_description)
    response = cv.count_vectorizer()
    return { 'Response' : response }



if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")

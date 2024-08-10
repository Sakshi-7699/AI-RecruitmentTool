import PyPDF2
import re

from fastapi import UploadFile

resume_path = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/sample.pdf'
job_description = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/job_description.txt'


def preprocess_text(text):
    # Convert to lowercase and remove special characters
    text = re.sub(r'[^\w\s]', '', text.lower())
    return text

def preprocess_text_for_model(text):
    text = text.lower()
    text = re.sub('[^a-z]', ' ', text)
    text = re.sub(r'\d+', '', text)
    text = ' '.join(text.split())
    return text

def extract_text_from_pdf_path(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_data_from_text(file_path) :
    file_contents =''
    with open(file_path, 'r') as file:
        file_contents = file.read()
    return file_contents

def get_resume_and_jd_preprocessed(resume, jd) :
    resume_text = extract_text_from_pdf(resume_path)
    job_description_text = extract_data_from_text(job_description)
    processed_resume = preprocess_text(resume_text)
    processed_job_description = preprocess_text(job_description_text)
    return processed_resume, processed_job_description


def get_preprocessed_text(file_path) :
    data = extract_text_from_pdf_path(file_path)
    # data = extract_text_from_pdf(file)
    result = preprocess_text(data)
    return result


from io import BytesIO
from PyPDF2 import PdfReader

def extract_text_from_pdf(upload_file: UploadFile) -> str:
    print(f'THIS IS ********** {(upload_file.filename)}')
    print(f'THIS IS ********** {type(upload_file)}')
    pdf_file = BytesIO(upload_file.file.read())
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text
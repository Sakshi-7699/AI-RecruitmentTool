import PyPDF2
import re

resume_path = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/sample.pdf'
job_description = '/Users/sakshigupta/Desktop/FYP/AI-RecruitmentTool/back-end/data/job_description.txt'


def preprocess_text(text):
    # Convert to lowercase and remove special characters
    text = re.sub(r'[^\w\s]', '', text.lower())
    return text
def extract_text_from_pdf(pdf_path):
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
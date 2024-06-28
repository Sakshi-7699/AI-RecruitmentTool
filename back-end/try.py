
import PyPDF2
import re

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from gensim.models import Word2Vec

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


resume_text = extract_text_from_pdf(resume_path)
job_description_text = extract_data_from_text(job_description)
processed_resume = preprocess_text(resume_text)
processed_job_description = preprocess_text(job_description_text)

# Tokenize the texts
resume_tokens = processed_resume.split()
job_description_tokens = processed_job_description.split()

# Combine tokens for Word2Vec training
sentences = [resume_tokens, job_description_tokens]

# Train Word2Vec model
model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)

def get_sentence_vector(tokens, model):
    word_vectors = [model.wv[word] for word in tokens if word in model.wv]
    if word_vectors:
        return np.mean(word_vectors, axis=0)
    else:
        return np.zeros(model.vector_size)

# Get vector representations for resume and job description
resume_vector = get_sentence_vector(resume_tokens, model)
job_description_vector = get_sentence_vector(job_description_tokens, model)

# Compute cosine similarity
similarity = cosine_similarity([resume_vector], [job_description_vector])[0][0]

print(f"Similarity between resume and job description: {similarity:.4f}")
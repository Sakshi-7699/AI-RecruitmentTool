
from gensim.models import Doc2Vec
from numpy.linalg import norm
import numpy as np
import re



def preprocess_text(text):
    text = text.lower()
    text = re.sub('[^a-z]', ' ', text)
    text = re.sub(r'\d+', '', text)
    text = ' '.join(text.split())
    return text


def get_match_score(input_CV, input_JD) :
    input_CV, input_JD = preprocess_text(input_CV), preprocess_text(input_JD)
    model = Doc2Vec.load('cv_job_maching.model')
    v1 = model.infer_vector(input_CV.split())
    v2 = model.infer_vector(input_JD.split())
    similarity = 100*(np.dot(np.array(v1), np.array(v2))) / (norm(np.array(v1)) * norm(np.array(v2)))
    print(round(similarity, 2))
    return similarity
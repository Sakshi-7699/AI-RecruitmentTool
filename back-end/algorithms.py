from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Doc2Vec
from numpy.linalg import norm
import numpy as np
import requests
import helper


API = {
    'SUMMARY' : "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    'BEHAVIOURAL' : "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"
}


class Algorithms:
    def __init__(self) -> None:
        self.headers = {"Authorization": "Bearer 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"}
        

    def get_match_percentage(self,count_matrix):
        MatchPercentage=cosine_similarity(count_matrix)[0][1]*100
        print(f'Match Percentage is: {MatchPercentage:.2f}')
        return round(MatchPercentage,2)
    
    def count_vectorizer(self,resume, job_description) : 
        resume = helper.get_preprocessed_text(resume)
        job_description = helper.preprocess_text(job_description)
        vectorizer = CountVectorizer()
        count_matrix=vectorizer.fit_transform([resume, job_description])
        return self.get_match_percentage(count_matrix)
    
    def tfidf_vectorizer(self,resume, job_description) :
        vectorizer = TfidfVectorizer()
        count_matrix=vectorizer.fit_transform([resume, job_description])
        return self.get_match_percentage(count_matrix)
    
    def generate_summary(self,document):
        API_URL = API['SUMMARY']
        response = requests.post(API_URL, headers=self.headers, json={ "inputs": document})
        return response.json()[0]['summary_text']
    
    def get_behavioural_scores(self, document,behavioural_list : list):
        API_URL = API['BEHAVIOURAL']
        payload = {
            "inputs": document,
            "parameters": {
                "candidate_labels": behavioural_list,
            }
        }
        response = requests.post(API_URL, headers=self.headers, json=payload)
        scores = response.json()['scores']
        result = {}
        for b,s in zip(behavioural_list, scores):
            result[b] = round(s * 100, 2)
        return result

    def run_match_on_database(self,resume:str, job_description:str) :
        job_description = helper.preprocess_text(job_description)
        resume = helper.preprocess_text(resume)
        vectorizer = CountVectorizer()
        count_matrix=vectorizer.fit_transform([resume, job_description])
        return self.get_match_percentage(count_matrix)
    
    def get_match_score_from_model(self,input_CV, input_JD) :
        input_CV = helper.get_preprocessed_text(input_CV)
        input_JD = helper.preprocess_text_for_model(input_JD)
        model = Doc2Vec.load('models/cv_job_maching.model')
        v1 = model.infer_vector(input_CV.split())
        v2 = model.infer_vector(input_JD.split())
        similarity = 100*(np.dot(np.array(v1), np.array(v2))) / (norm(np.array(v1)) * norm(np.array(v2)))
        print(round(similarity, 2))
        return similarity

        
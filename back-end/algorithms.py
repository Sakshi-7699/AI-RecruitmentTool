from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import helper
import requests


API = {
    'SUMMARY' : "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
}


class Algorithms:
    def __init__(self,resume=None, job_description=None) -> None:
        self.job_description ,self.resume = helper.get_resume_and_jd_preprocessed(resume=resume, jd=job_description)
        self.headers = {"Authorization": "Bearer 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"}
        

    def get_match_percentage(self,count_matrix):
        MatchPercentage=cosine_similarity(count_matrix)[0][1]*100
        print(f'Match Percentage is: {MatchPercentage:.2f}')
        return round(MatchPercentage,2)
    
    def count_vectorizer(self) : 
        vectorizer = CountVectorizer()
        count_matrix=vectorizer.fit_transform([self.resume,self.job_description])
        return self.get_match_percentage(count_matrix)
    
    def tfidf_vectorizer(self) :
        vectorizer = TfidfVectorizer()
        count_matrix=vectorizer.fit_transform([self.resume,self.job_description])
        return self.get_match_percentage(count_matrix)
    
    def generate_summary(self,document):

        API_URL = API['SUMMARY']
        response = requests.post(API_URL, headers=self.headers, json={ "inputs": document})
        return response.json()[0]['summary_text']

        
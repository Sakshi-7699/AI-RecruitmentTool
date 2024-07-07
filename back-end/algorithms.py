from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import helper



class Algorithms:
    def __init__(self,resume, job_description) -> None:
        self.job_description ,self.resume = helper.get_resume_and_jd_preprocessed(resume=resume, jd=job_description)

    def count_vectorizer(self) : 
        vectorizer = CountVectorizer()
        count_matrix=vectorizer.fit_transform([self.resume,self.job_description])
        MatchPercentage=cosine_similarity(count_matrix)[0][1]*100
        print(f'Match Percentage is: {MatchPercentage:.2f}')
        return round(MatchPercentage,2)
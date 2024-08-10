import pytest
from unittest.mock import patch, MagicMock
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from algorithms import Algorithms  


@pytest.fixture
def algorithms():
    return Algorithms()


@patch('algorithms.helper.get_preprocessed_text', return_value="sample preprocessed resume text")
@patch('algorithms.helper.preprocess_text', return_value="sample preprocessed job description")
def test_count_vectorizer(mock_preprocess_jd, mock_preprocess_resume, algorithms):
    result = algorithms.count_vectorizer("resume path", "job description path")
    assert isinstance(result, float)
    assert 0 <= result <= 100
    mock_preprocess_resume.assert_called_once_with("resume path")
    mock_preprocess_jd.assert_called_once_with("job description path")


@patch('algorithms.helper.preprocess_text', return_value="sample preprocessed job description")
@patch('algorithms.helper.get_preprocessed_text', return_value="sample preprocessed resume text")
def test_tfidf_vectorizer(mock_preprocess_jd, mock_preprocess_resume, algorithms):
    result = algorithms.tfidf_vectorizer("resume path", "job description path")
    assert isinstance(result, float)
    assert 0 <= result <= 100
    mock_preprocess_resume.assert_called_once_with("resume path")
    mock_preprocess_jd.assert_called_once_with("job description path")


@patch('requests.post')
def test_generate_summary(mock_post, algorithms):
    mock_response = MagicMock()
    mock_response.json.return_value = [{'summary_text': 'This is a summary.'}]
    mock_post.return_value = mock_response
    
    document = "This is a test document."
    summary = algorithms.generate_summary(document)
    
    assert summary == 'This is a summary.'
    mock_post.assert_called_once_with(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        headers={"Authorization": "Bearer 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"},
        json={"inputs": document}
    )


@patch('requests.post')
def test_get_behavioural_scores(mock_post, algorithms):
    mock_response = MagicMock()
    mock_response.json.return_value = {
        'scores': [0.9, 0.8, 0.1]
    }
    mock_post.return_value = mock_response
    
    document = "This is a test document."
    behavioural_list = ["Leadership", "Teamwork", "Creativity"]
    scores = algorithms.get_behavioural_scores(document, behavioural_list)
    
    expected_scores = {
        "Leadership": 90.0,
        "Teamwork": 80.0,
        "Creativity": 10.0
    }
    
    assert scores == expected_scores
    mock_post.assert_called_once_with(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        headers={"Authorization": "Bearer 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"},
        json={
            "inputs": document,
            "parameters": {
                "candidate_labels": behavioural_list
            }
        }
    )


@patch('algorithms.helper.preprocess_text', return_value="sample preprocessed job description")
def test_run_match_on_database(mock_preprocess_jd, algorithms):
    resume = "This is the resume text."
    job_description = "This is the job description."
    result = algorithms.run_match_on_database(resume, job_description)
    
    assert isinstance(result, float)
    assert 0 <= result <= 100
    mock_preprocess_jd.assert_called_once_with(job_description)


@patch('algorithms.helper.get_preprocessed_text', return_value="sample preprocessed resume text")
@patch('algorithms.helper.preprocess_text_for_model', return_value="sample preprocessed job description")
@patch('gensim.models.Doc2Vec.load')
def test_get_match_score_from_model(mock_load_model, mock_preprocess_jd, mock_preprocess_resume, algorithms):
    mock_model = MagicMock()
    mock_model.infer_vector.side_effect = [
        np.array([1, 2, 3]),  # v1 vector
        np.array([4, 5, 6])   # v2 vector
    ]
    mock_load_model.return_value = mock_model

    input_CV = "resume path"
    input_JD = "job description path"
    similarity = algorithms.get_match_score_from_model(input_CV, input_JD)
    
    expected_similarity = 100 * (np.dot(np.array([1, 2, 3]), np.array([4, 5, 6]))) / (np.linalg.norm(np.array([1, 2, 3])) * np.linalg.norm(np.array([4, 5, 6])))
    assert similarity == pytest.approx(expected_similarity)
    
    mock_preprocess_resume.assert_called_once_with(input_CV)
    mock_preprocess_jd.assert_called_once_with(input_JD)
    mock_load_model.assert_called_once_with('models/cv_job_maching.model')

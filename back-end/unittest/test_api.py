import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from main import app, collection, job_collection
from fastapi import UploadFile
import json
import io

client = TestClient(app)

# Mock database connection for testing
@pytest.fixture(autouse=True, scope="module")
def override_mongo():
    app.dependency_overrides[AsyncIOMotorClient] = lambda: AsyncIOMotorClient('mongodb://localhost:27017/test_db')
    yield
    AsyncIOMotorClient('mongodb://localhost:27017/test_db').drop_database('test_db')

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == "This is API for the system. Head over to /docs to access the endpoints"

def test_run_count_vectorizer():
    response = client.get("/count-vectorizer")
    assert response.status_code == 200
    assert "Response" in response.json()

@pytest.mark.asyncio
async def test_upload_candidate():
    resume_content = io.BytesIO(b"sample resume content")
    cover_letter_content = io.BytesIO(b"sample cover letter content")

    response = await client.post(
        "/add-candidate",
        data={
            "name": "John Doe",
            "email": "john@example.com",
            "phone_number": "1234567890",
            "address": "123 Main St",
            "experience": "5 years"
        },
        files={
            "resume": ("resume.pdf", resume_content, "application/pdf"),
            "cover_letter": ("cover_letter.pdf", cover_letter_content, "application/pdf")
        }
    )
    
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "Candidate uploaded successfully"
    assert "candidate_id" in response.json()

@pytest.mark.asyncio
async def test_get_candidates():
    response = await client.get("/candidates/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_candidate_profile():
    # Assuming we have added a candidate with id 1
    response = await client.get("/candidate-profile/1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_resume():
    # Assuming we have added a candidate with id 1
    response = await client.get("/resume/1")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_cover_letter():
    # Assuming we have added a candidate with id 1
    response = await client.get("/cover_letter/1")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_run_check_for_all():
    # Assuming we have a job with Job Id 1
    response = await client.post("/compatibility-check-all", json={"jobId": 1})
    assert response.status_code == 200
    assert "result" in response.json()
    assert isinstance(response.json()["result"], list)

@pytest.mark.asyncio
async def test_get_jobs():
    response = await client.get("/jobs/10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_login():
    credentials = {"username": "testuser", "password": "testpass"}
    response = client.post("/auth/login", json=credentials)
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["token"] == credentials["username"]

@pytest.mark.asyncio
async def test_upload():
    resume_content = io.BytesIO(b"sample resume content")
    cover_letter_content = io.BytesIO(b"sample cover letter content")
    job_description = "This is a sample job description"
    behavioral_values = json.dumps(["Teamwork", "Problem-solving"])

    response = await client.post(
        "/upload",
        data={
            "job_description": job_description,
            "behavioral_values": behavioral_values,
        },
        files={
            "resume": ("resume.pdf", resume_content, "application/pdf"),
            "cover_letter": ("cover_letter.pdf", cover_letter_content, "application/pdf"),
        },
    )
    assert response.status_code == 200
    assert "cover_letter_summary" in response.json()
    assert "behavioral_scores" in response.json()
    assert "resume_match_score" in response.json()
    assert "model_match_score" in response.json()

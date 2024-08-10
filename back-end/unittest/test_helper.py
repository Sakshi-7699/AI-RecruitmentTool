import pytest
import re
from unittest.mock import mock_open, patch
from io import BytesIO
from PyPDF2 import PdfReader
from fastapi import UploadFile

from helper import (
    preprocess_text,
    preprocess_text_for_model,
    extract_text_from_pdf_path,
    extract_data_from_text,
    get_resume_and_jd_preprocessed,
    get_preprocessed_text,
    extract_text_from_pdf
)


def test_preprocess_text():
    text = "Hello, World! This is a Test."
    expected_result = "hello world this is a test"
    assert preprocess_text(text) == expected_result


def test_preprocess_text_for_model():
    text = "Hello123, World! This is a Test."
    expected_result = "hello world this is a test"
    assert preprocess_text_for_model(text) == expected_result


@patch("builtins.open", new_callable=mock_open, read_data="This is a sample job description.")
def test_extract_data_from_text(mock_file):
    file_path = "fake_path.txt"
    result = extract_data_from_text(file_path)
    assert result == "This is a sample job description."
    mock_file.assert_called_once_with(file_path, 'r')


@patch("builtins.open", new_callable=mock_open, read_data="PDF file data")
@patch("PyPDF2.PdfReader")
def test_extract_text_from_pdf_path(mock_reader, mock_file):
    mock_pdf = mock_reader.return_value
    mock_pdf.pages = [mock_reader.PageObject()] * 2
    mock_pdf.pages[0].extract_text.return_value = "This is page 1."
    mock_pdf.pages[1].extract_text.return_value = "This is page 2."

    pdf_path = "fake_pdf_path.pdf"
    result = extract_text_from_pdf_path(pdf_path)
    expected_result = "This is page 1.This is page 2."
    assert result == expected_result
    mock_file.assert_called_once_with(pdf_path, 'rb')


@patch("builtins.open", new_callable=mock_open, read_data="Sample PDF content")
@patch("helper.extract_text_from_pdf_path", return_value="Sample resume text")
@patch("helper.extract_data_from_text", return_value="Sample job description")
def test_get_resume_and_jd_preprocessed(mock_extract_jd, mock_extract_resume, mock_file):
    resume_path = "fake_resume_path.pdf"
    job_description_path = "fake_job_description.txt"
    
    resume_text, job_description_text = get_resume_and_jd_preprocessed(resume_path, job_description_path)
    
    assert resume_text == "sample resume text"
    assert job_description_text == "sample job description"
    
    mock_extract_resume.assert_called_once_with(resume_path)
    mock_extract_jd.assert_called_once_with(job_description_path)


@patch("helper.extract_text_from_pdf_path", return_value="Sample PDF text")
def test_get_preprocessed_text(mock_extract):
    file_path = "fake_path.pdf"
    result = get_preprocessed_text(file_path)
    expected_result = "sample pdf text"
    assert result == expected_result
    mock_extract.assert_called_once_with(file_path)


@patch("helper.BytesIO")
@patch("helper.PdfReader")
def test_extract_text_from_pdf(mock_pdf_reader, mock_bytes_io):
    # Mock the UploadFile
    mock_upload_file = UploadFile(filename="test.pdf", file=BytesIO(b"pdf content"))
    
    # Mock PdfReader behavior
    mock_reader_instance = mock_pdf_reader.return_value
    mock_reader_instance.pages = [mock_pdf_reader.PageObject()]
    mock_reader_instance.pages[0].extract_text.return_value = "Sample text from PDF."
    
    result = extract_text_from_pdf(mock_upload_file)
    expected_result = "Sample text from PDF."
    
    assert result == expected_result
    mock_pdf_reader.assert_called_once()
    mock_bytes_io.assert_called_once()


import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlgoResponseService {

  readonly rootUrl = 'http://localhost:8000/'
  constructor(private http : HttpClient) { }

  getAll(key: string):Observable<any[]>{
    return this.http.get<any>(this.rootUrl + 'count-vectorizer').pipe(
      map(response => response[key])  // Extract the specific key from the response
    );
  
  }
  getSummary():Observable<any[]>{
    return this.http.get<any>(this.rootUrl + 'summarize').pipe(
      map(response => response)  // Extract the specific key from the response
    );
  }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',  // Assuming the backend expects JSON
  });

  // uploadFiles(formData: any): Observable<any> {
  //   console.log('data received : ',formData)
  //   return this.http.post(this.rootUrl + 'upload', formData, { headers : new HttpHeaders({
  //     'Content-Type': 'application/json',  // Assuming the backend expects JSON
  //   })  })
  // }


  uploadFiles(
    resume: File,
    coverLetter: File,
    jobDescription: string,
    behavioralValues: string[]
  ): Observable<any> {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('cover_letter', coverLetter);
    formData.append('job_description', jobDescription);
    formData.append('behavioral_values', JSON.stringify(behavioralValues)); // Convert array to JSON string

    return this.http.post(this.rootUrl + 'upload', formData);
  }


}

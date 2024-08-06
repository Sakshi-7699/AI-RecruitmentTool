import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  readonly rootUrl = 'http://localhost:8000/'
  constructor(private http : HttpClient) { }

  getAllJobs():Observable<any[]>{
    return this.http.get<any>(this.rootUrl + 'jobs/6')
  }
  getJobsWithParams():Observable<any[]>{
    return this.http.get<any>(this.rootUrl + 'summarize').pipe(
      map(response => response)  
    );
  }

  

  
}

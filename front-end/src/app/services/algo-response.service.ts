import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlgoResponseService {

  readonly rootUrl = 'http://127.0.0.1:8000/'
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


  uploadFiles(formData: any): Observable<any> {
    console.log('data received : ',formData)
    return this.http.post(this.rootUrl + 'upload/', formData);
  }



}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlgoResponseService {

  readonly rootUrl = 'http://127.0.0.1:8000/count-vectorizer'
  constructor(private http : HttpClient) { }

  getAll(key: string):Observable<any[]>{
    return this.http.get<any>(this.rootUrl).pipe(
      map(response => response[key])  // Extract the specific key from the response
    );
  }


}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Response } from '../apiresponse';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
  private submitRegisterUrl = 'http://localhost:4000/api/register';
  private getUsersUrl = 'http://localhost:4000/api/getUsers';
  private addNewTopicUrl = 'http://localhost:4000/api/addNewAssignmentTopic';

  submitRegister(values): Observable<Response[]> {
    return this.http.post<Response[]>(this.submitRegisterUrl, JSON.stringify(values), httpOptions)
      .pipe(
        tap(response => response
        ));
  }

  getUsers(): Observable<Response[]> {
    return this.http.get<Response[]>(this.getUsersUrl)
      .pipe(
        map(response => response
        ));
  }

  getUserDetails(uID): Observable<Response[]> {
    return this.http.get<Response[]>(`http://localhost:4000/api/getUserDetails/${uID}`).pipe(map(response => response));
  }

  uploadPhoto(image: File, uid): Observable<any[]> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('ref_id', uid);
    return this.http.post<any[]>('http://localhost:4000/api/uploadPhoto', formData).pipe(map(response => response));
  }

  getStates() {
    return this.http.get<any[]>('../assets/data/state-city.json').pipe(map(response => response));
  }

  submitNewTopic(values): Observable<Response[]> {
    return this.http.post<Response[]>(this.addNewTopicUrl, JSON.stringify(values), httpOptions)
      .pipe(
        tap(response => response
        ));
  }

  submitTaskAssignment(values): Observable<Response[]> {
    return this.http.post<Response[]>('http://localhost:4000/api/submitTask', JSON.stringify(values), httpOptions).pipe(tap(response => response))
  }

  getTopics(): Observable<Response[]> {
    return this.http.get<Response[]>('http://localhost:4000/api/getAllTopics').pipe(map(response => response));
  }

}


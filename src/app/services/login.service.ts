import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Response } from '../apiresponse';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private submitLoginUrl = 'http://localhost:4000/api/login';
  private updatePasswordUrl = 'http://localhost:4000/api/updatePassword';
  private submitSocialLoginUrl = 'http://localhost:4000/api/socialLogin';

  constructor(private http: HttpClient) { }

  submitLogin(loginUser): Observable<Response[]> {
    return this.http.post<Response[]>(this.submitLoginUrl, JSON.stringify(loginUser), httpOptions)
      .pipe(
        tap(response => response
        ));
  }

  updateNewPassword(values): Observable<Response[]> {
    return this.http.post<Response[]>(this.updatePasswordUrl, JSON.stringify(values), httpOptions).pipe(tap(response => response));
  }

  submitUserSocialLogin(email): Observable<Response[]> {
    return this.http.post<Response[]>(this.submitSocialLoginUrl, JSON.stringify(email), httpOptions).pipe(tap(response => response));
  }
}

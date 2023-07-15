import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

  userName: string
  constructor(private http: HttpClient) { }


  testApi(testParam: string): Observable<boolean> {
    return this.http.get('/api/posts')
      .pipe(
        map(result => {
         console.log('Posts : : ',result)
          return true;
        })
      );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('/api/auth', { email: email, password: password })
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
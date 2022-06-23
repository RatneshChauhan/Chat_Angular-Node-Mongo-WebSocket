import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/user-list/user/user';

@Injectable()
export class SignupService {

  constructor(private http: HttpClient) { }

  signup(user: User): Observable<boolean> {
    return this.http.post<{ token: string }>('/api/register',
      { user }
    ).pipe(map(result => {
      console.log('signed up:   ', result)
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
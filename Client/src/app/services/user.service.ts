import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { OktaAuthService } from '@okta/okta-angular';
import { User } from '../user-list/user/user';
import { Message } from '../message-list/message';
import { Subject, Observable } from 'rxjs';




export interface UserDetail {
  user: User;
  messages: Message[];
}

@Injectable({
  providedIn: 'root'
})


export class UserService {

  userClickSubscription = new Subject<UserDetail>();
  
  userSearchSubscription = new Subject();
  disableEditingSubscription = new Subject();

    constructor(private http: HttpClient) {
  }

  private async request(method: string, url: string, data?: any, responseType?: any) {
   // const token = await this.oktaAuth.getAccessToken();
   const token = localStorage.getItem('access_token')

    console.log('request ' + JSON.stringify(data));
    const result = this.http.request(method, url, {
      body: data,
      responseType: responseType || 'json',
      observe: 'body',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return new Promise<any>((resolve, reject) => {
      result.subscribe(resolve as any, reject as any);
    });
  }

  getUsers() {
    // get
    return this.request('get', `/api/users`);
  }
 
  searchHandler(value:any) {
    this.userSearchSubscription.next({ value });
  }

}

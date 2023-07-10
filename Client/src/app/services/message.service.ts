import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
//import { OktaAuthService } from '@okta/okta-angular';
import { Message } from '../components/message-list/message';
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  privateMessageRecievedSubscription = new Subject<Message>();
  constructor(private http: HttpClient) { }
  messageSentSubscription = new Subject();

  private async request(method: string, url: string, data?: any, responseType?: any) {
    // const token = await this.oktaAuth.getAccessToken();
    const token = localStorage.getItem('access_token')

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

  getMessages(toUserId: String, fromUserId:string): Observable<Message[]> {
    return this.http.get<Message[]>(`/api/getMessages/` + toUserId +'/'+ fromUserId);
  }

  saveMessage(message: Message) {
    console.log('save Message  ', message)
    return this.request('post', `/api/saveMessages`, message);
  }

}

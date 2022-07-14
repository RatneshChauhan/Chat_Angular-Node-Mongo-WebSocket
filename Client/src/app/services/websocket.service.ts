import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { IOEventName } from '../ioevent-name'

@Injectable({
  providedIn: 'root'
})

// Establishes connection, joins the users, recieves the private messages 
export class WebsocketService {
  private socket: any;


  constructor(private jwtHelper: JwtHelperService) {

    this.socket = io.connect(environment.socketUrl, {
      transports: [`websocket`],
    })
    this.join()
  }

  getLoggedInUser() {
    //@ts-ignore
    return this.jwtHelper.decodeToken(localStorage.getItem('access_token'))
  }

  sendPrivateMessage(message: any) {
    this.socket.emit("privateMessage", message);
  }

  sendSeenReciept(user: any, messages:any) {
    this.socket.emit("seen", user, messages);
  }

  join() {
    const loggedInUser = this.getLoggedInUser()
    console.log('loggedInUser:  ', loggedInUser)
    this.socket.emit("joinUser", loggedInUser);
    return loggedInUser
  }

  typing(message: any) {
    this.socket.emit("typing", message);
  }

  disconnect() {
    const loggedInUser = this.getLoggedInUser()
    this.socket.emit('forceDisconnect', loggedInUser);
  }

  //@ts-ignore
  public onEvent<T>(event: IOEventName): Observable<T | Array<T>> {
    return new Observable<T>((observer: any) => {
      console.log('client subscribed to event: ', event)
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }
}

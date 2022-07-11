import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { IOEventName } from '../ioevent-name'
import { Message } from '../message-list/message';
import { WebsocketService } from '../services/websocket.service';
import { User } from './user/user';
import { MessageService } from '../services/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => online', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ]),
      transition('online => void', [
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UserListComponent implements OnInit {

  userList: User[];
  searchedText = '';
  searchTxt: string
  messageSub: Subscription;
  messages: Message[] = []
  count: number = 0;
  loggedInUser: any;
  

  constructor(private userService: UserService,
    private messageService: MessageService,
    private wsService: WebsocketService, public authService: AuthService,
    private _snackBar: MatSnackBar) { }

  async ngOnInit() {

    this.loggedInUser = this.wsService.getLoggedInUser()

    this.userList = await this.userService.getUsers(this.loggedInUser.email)

    this.userService.userSearchSubscription.subscribe((txt: any) => {
      console.log('Searching...', txt)
      this.searchTxt = txt
    })
  }

  ngAfterViewInit() {

    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_JOIN_EVENT)
      .subscribe((data: any) => {
        console.log('Side user list Websocket USER JOINED IN: ', data)
        this.messageHandler(data)
      });


    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_PRIVATE_EVENT + '_' + this.loggedInUser.userId as IOEventName)
      .subscribe((data: any) => {
        console.log('Side user list Websocket PRIVATE Message: ', data)
        this.messageHandler(data)
      });

    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_CONNECT_EVENT)
      .subscribe((data: any) => {
        console.log('Side user list Websocket CONNECT: ', data)
        this.messageHandler(data)
      });

    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_DISCONNECT_EVENT)
      .subscribe((data: any) => {
        console.log('Side user list Websocket DISCONNECT: ', data)
        this.messageHandler(data)
      });

    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_TYPING_EVENT)
      .subscribe((data: any) => {
        console.log('Side user list Websocket TYPING: ', data)
        this.messageHandler(data)
      });
  }

  messageHandler(data: any) {
    const index: any = this.userList.findIndex((user: any) => user.email === data.from.senderEmail);
    switch (data.text) {
      case 'join':
        if (!index) {
          this.userList.push(data.user);
          this.handleNetwork(data.user.name, 'joined')
        }
        break;

      case 'typing':
        this.userList[index].status = 'typing';
        this.userList[index].typing = true;
        break;

      case 'online':
        this.userList[index].status = 'online';
        this.handleNetwork(data.from.senderUserName, 'online')
        break;

      case 'offline':
        this.userList[index].status = 'offline';
        this.handleNetwork(data.from.senderUserName, 'offline')
        break;

      // default is for incoming message from WS
      default:
        if (!this.userList[index].messageCount)
          this.userList[index].messageCount = 0;

        this.userList[index].status = 'online';
        this.userList[index].messageCount += 1
        this.userList[index].typing = false
    }
  }

  handleNetwork(user: string, status: string) {
    if (this.authService.loggedIn && user) {
      this._snackBar.open(user + " " + status, 'Dismiss', {
        duration: 50000,
        panelClass: ['ratnesh-snack']
      });
    }
  }

  searchedUsers(value?: any) {
    if (value || (typeof value === 'string' && value.length === 0)) {
      this.searchedText = value;
    }
    if (this.userList && this.userList.length > 0) {
      return this.userList.filter((user: any) => {
        if (this.searchedText.trim().length === 0 ||
          user.title.indexOf(this.searchedText.trim()) > -1 ||
          user.description.indexOf(this.searchedText.trim()) > -1) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      return [];
    }

  }

  getMessages(selectedUserId: string, index: number) {

    this.messageService.getMessages(selectedUserId, this.loggedInUser.userId).subscribe((res: any) => {
      
      console.log('Selected Coversation: ', res)
      this.messages = []
      res.forEach((userMessages: any) => {
        userMessages.messages.forEach((message: any) => {
          this.messages.push(message)
        });
      });
      this.userService.userClickSubscription.next({ user: this.userList[index], messages: this.messages });
    });
  }

  userClickHandler(data: any) {

    const index: any = this.userList.findIndex((user: any) => user._id === data._id);
    this.getMessages(data._id, index);
    this.userList.forEach((user: any) => user.selected = false);
    this.userList[index].selected = true;
    this.userList[index].messageCount = 0;
  }

  // getSelectedUserIndex() {
  //   const index = this.userList.findIndex((user: any) => user.selected === true);
  //    this.selectedUser = this.userList[index];
  //   return index;
  // }

  removeSelection() {
    this.userList.forEach((user: any) => user.selected = false);
  }


}

import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,

  AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { IOEventName } from '../ioevent-name'
import { Message } from '../message-list/message';
import { WebsocketService } from '../services/websocket.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {

  socket: any;
  messageModel: Message = new Message();
  chat: Message[] = [];
  selectedUser = '';
  selectedEmail: string = ''
  selectedUserId: string
  ownId: string
  ownEmail: string
  ownUser: string
  messageSub: Subscription;
  seen: boolean;

  constructor(private jwtHelper: JwtHelperService,
    private wsService: WebsocketService, private route: ActivatedRoute,
    private userService: UserService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.getCurrentUser()
    this.getOldMessages()
    this.sentMessageHandler()
  }

  sentMessageHandler() {
    this.messageService.messageSentSubscription.subscribe((MessageDetail: any) => {
      this.updateChatWindow(MessageDetail)
    })
  }
  getCurrentUser() {
    const loggedInUser = this.wsService.getLoggedInUser()

    this.ownId = loggedInUser.userId;
    this.ownEmail = loggedInUser.email
    this.ownUser = loggedInUser.name
    this.getNewMessage()
    this.markAsSeen()
  }

  // Database messages
  getOldMessages() {

    this.userService.userClickSubscription.subscribe((UserDetail: any) => {
      console.log('Selected User:  ', UserDetail.user)
      console.log('Selected User messages: ', UserDetail.messages)

      this.selectedUser = UserDetail.user.name
      this.selectedEmail = UserDetail.user.email
      this.selectedUserId = UserDetail.user._id

      this.wsService.sendSeenReciept(UserDetail.user, UserDetail.messages)

      this.chat = []
      UserDetail.messages.forEach((message: any) => {
        this.updateChatWindow(message)
      });

      this.messagesSortByTS(this.chat)
    });
  }

  updateChatWindow(message: any) {
    this.chat.push({
      to: message.to.recieverUserName,
      from: message.from.senderUserName,
      text: message.text,
      ts: message.ts,
      type: message.to.recieverUserName === this.selectedUser ? 'other' : 'own',
      seen: message.seen ? true : false

    })
  }

  //WebSocket Message (Pvt event)
  getNewMessage() {
    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_PRIVATE_EVENT + '_' + this.ownId as IOEventName)
      .subscribe((data: any) => {
        console.log(IOEventName.WS_PRIVATE_EVENT + '_' + this.ownId)
        console.log('Main Chat box Websocket message: ', data)
        if (this.selectedUserId === data.from.senderUserId)
          this.updateChatWindow(data)
        this.messagesSortByTS(this.chat)
      });
  }

  //WebSocket Message (Seen event)
  markAsSeen() {
    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_SEEN)
      .subscribe((data: any) => {
        console.log('Mark as read: ', data.messages)
        this.chat = []
        data.messages.forEach((item: any) => {
          item.seen = true
          this.updateChatWindow(item)
        });
        this.messagesSortByTS(this.chat)
      });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }

  messagesSortByTS(chat: any) {
    //@ts-ignore
    this.chat.sort(function (x, y) {
      return x.ts - y.ts;
    });
  }
}

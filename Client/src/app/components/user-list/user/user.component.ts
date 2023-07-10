import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { User } from './user';
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import { IOEventName } from '../../../ioevent-name'
import { Message } from '../../message-list/message';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})

export class UserComponent implements OnInit {

  @Input() user: any;
  selected: boolean = false;
  count: number = 0;

  @Output('userClicked') userClicked = new EventEmitter();

  messageSub: Subscription;

  constructor(private messageService: MessageService, private wsService: WebsocketService) { }

  ngOnInit() {
    console.log('User: ', this.user)
  }

  ngAfterViewInit() {

    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_PRIVATE_EVENT + '_' + this.user._id as IOEventName)
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

  }

  messageHandler(data: any) {
    switch (data.text) {
      case 'typing...':
        //@ts-ignore
        document.getElementById(data.from.senderUserId).innerHTML = ' <span '
          + 'style="text-align: center; '
          + 'color: black;"><img src ="assets/typing.gif" style="height:30px" /></span>';
        break;

      case 'online':
        if (this.user.email === data.from.senderEmail)
          this.user.status = 'ONLINE'
        break;

      case 'offline':
        if (this.user.email === data.from.senderEmail)
          this.user.status = 'OFFLINE'
        break;

      // default is for Private message from WS
      default:
        this.count += 1
        //@ts-ignore
        document.getElementById(data.from.senderUserId).innerHTML = ' <span '
          + 'style="text-align: center; '
          + 'color: black; '
          + 'padding: 3px;">' + data.text + '</span>';

        //@ts-ignore
        document.getElementById(data.from.senderUserId + '_count').innerHTML = 
        ' <span class="msgCount" >' + this.count + '</span>';

    }
  }

  ngOnDestroy() {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }

  userClickHandler() {
    //@ts-ignore
    this.user.selected = true;
    this.userClicked.emit();
  }
}

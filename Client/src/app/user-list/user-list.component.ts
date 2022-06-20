import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { IOEventName } from '../ioevent-name'
import { Message } from '../message-list/message';
import { WebsocketService } from '../services/websocket.service';
import { User } from './user/user';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList: User[];
  filteredUsers: User[];
  selectedUser: User;
  loading = false;
  searchedText = '';
  searchTxt: string
  messageSub: Subscription;
  messages: Message[] = []
  count: number = 0;
  loggedInUser: any
  isSelected:boolean = false



  constructor(private userService: UserService,
    private messageService: MessageService,
    private wsService: WebsocketService) { }

  async ngOnInit() {
    this.userList = await this.userService.getUsers()
    this.filteredUsers = this.userList;

    this.userService.userSearchSubscription.subscribe((txt: any) => {
      console.log('Searching...', txt)
      this.searchTxt = txt
    })
  }

  ngAfterViewInit() {
    this.loggedInUser = this.wsService.getLoggedInUser()

    this.messageSub = this.wsService
      .onEvent<Message>(IOEventName.WS_PRIVATE_EVENT + '_' + this.loggedInUser.userID as IOEventName)
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
    switch (data.text) {
      case 'typing':
        this.userList.map((obj: User) => {
          obj.email === data.from.senderEmail ? obj.status = 'typing' : obj
        })
        break;

      case 'online':
        this.userList.map((obj: User) => {
          obj.email === data.from.senderEmail ? obj.status = 'online' : obj
        })
        break;

      case 'offline':
        this.userList.map((obj: User) => {
          obj.email === data.from.senderEmail ? obj.status = 'offline' : obj
        })
        break;

      // default is for incoming message from WS
      default:
        this.userList.map((obj: User) => {
          obj.email === data.from.senderEmail ? obj.status = 'online' : obj
        })
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

    this.messageService.getMessages(selectedUserId, this.loggedInUser.userID).subscribe((res: any) => {
      this.loading = true;
      console.log('Selected Coversation: ', res)
      this.messages= []
      res.forEach((userMessages: any) => {
        userMessages.messages.forEach((message:any) => {
          this.messages.push(message)
        });
        
        this.userService.userClickSubscription.next({ user: this.userList[index], messages: this.messages });
      });
    });
  }

  userClickHandler(data: any) {
  
    const index: any = this.userList.findIndex((user: any) => user._id === data._id);
    this.getMessages(data._id, index);
    this.userList.forEach((user: any) => user.selected = false);
    this.userList[index].selected = true;
  }

  getSelectedUserIndex() {
    const index = this.userList.findIndex((user: any) => user.selected === true);
    // this.selectedUser = this.userList[index];
    return index;
  }

  removeSelection() {
    this.userList.forEach((user: any) => user.selected = false);
  }


}

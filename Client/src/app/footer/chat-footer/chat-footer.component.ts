import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from '../../message-list/message';
import { WebsocketService } from '../../services/websocket.service';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.scss']
})
export class ChatFooterComponent implements OnInit {
  selectedUser = '';
  selectedEmail: string = ''
  selectedUserId: string
  fromUserId: string
  fromUserEmail: string
  fromUser: string
  msgTxt: string
  @Output('messageSubmitted') messageSubmitted = new EventEmitter();

  form: FormGroup;
  constructor(private fb: FormBuilder,
    private wsService: WebsocketService, private userService: UserService, private messageService: MessageService) {
    this.form = this.fb.group({
      input: ['', [Validators.required, Validators.minLength(2)]],
    })
  }

  ngOnInit(): void {
    this.getCurrentUser()
    this.getSelectedUser()
  }

  getCurrentUser() {
    const loggedInUser = this.wsService.getLoggedInUser()
    this.fromUserId = loggedInUser.userID;
    this.fromUserEmail = loggedInUser.userEmail
    this.fromUser = loggedInUser.userName
  }

  getSelectedUser() {
    this.userService.userClickSubscription.subscribe((UserDetail: any) => {
      console.log('Selected User:  ', UserDetail.user)
      console.log('Selected User messages: ', UserDetail.messages)

      this.selectedUser = UserDetail.user.name
      this.selectedEmail = UserDetail.user.email
      this.selectedUserId = UserDetail.user._id
      
    })
  }

  onSubmit(event: any) {
    this.sendMessage(event.target.value)
    this.clearInput()
  }

  keyPressed(event: any) {
    if (event.keyCode === 13) {
      console.log("--- Enter key is pressed ---", event.target.value);
      this.onSubmit(event)
      return;
    }
    this.onTyping(event.target.value)
  }

  onTyping(typingText: string) {

    const from: any = {
      senderUserId: this.fromUserId,
      senderUserName: this.fromUser,
      senderEmail: this.fromUserEmail
    }
    const to: any = {
      recieverUserId: this.selectedUserId,
      recieverUserName: this.selectedUser,
      recieverEmail: this.selectedEmail
    }

    const message = {
      ...new Message(),
      ...{
        to: to,
        from: from,
        text: 'typing...',
        ts: Math.floor(Date.now() / 1000)
      }
    };
    this.wsService.typing(message)
  }

  clearInput() {
    this.msgTxt = ''
  }

  sendMessage(messageText: string) {
    const from: any = { senderUserId: this.fromUserId, senderUserName: this.fromUser, senderEmail: this.fromUserEmail }
    const to: any = { recieverUserId: this.selectedUserId, recieverUserName: this.selectedUser, recieverEmail: this.selectedEmail }

    const message = {
      ...new Message(),
      ...{
        to: to,
        from: from,
        text: messageText,
        ts: Math.floor(Date.now() / 1000)
      }
    };

    this.wsService.sendPrivateMessage(message)
    this.messageService.saveMessage(message)
  }

}

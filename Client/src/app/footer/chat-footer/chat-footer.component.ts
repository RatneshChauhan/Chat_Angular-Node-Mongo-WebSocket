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
  placeHolder: string = "Please select a user to send messages"
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
    //@ts-ignore
    document.getElementById("msgArea").disabled = true;
  }

  getCurrentUser() {
    const loggedInUser = this.wsService.getLoggedInUser()
    this.fromUserId = loggedInUser.userId;
    this.fromUserEmail = loggedInUser.email
    this.fromUser = loggedInUser.name
  }

  getSelectedUser() {
    this.userService.userClickSubscription.subscribe((UserDetail: any) => {
      this.selectedUser = UserDetail.user.name
      this.selectedEmail = UserDetail.user.email
      this.selectedUserId = UserDetail.user._id

      this.placeHolder = "Type your message..."

      //@ts-ignore
      document.getElementById("msgArea").disabled = false;
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
    console.log('Typing to...', this.selectedUserId)

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
    console.log('Typing message...', message)
    this.wsService.typing(message)
  }

  clearInput() {
    this.msgTxt = ''
  }

  sendMessage(messageText: string) {
    const from: any = { senderUserId: this.fromUserId, senderUserName: this.fromUser, senderEmail: this.fromUserEmail }
    const to: any = { recieverUserId: this.selectedUserId, recieverUserName: this.selectedUser, recieverEmail: this.selectedEmail }

    const message: Message = {

      to: to,
      from: from,
      text: messageText,
      ts: Math.floor(Date.now() / 1000),
      type: 'own'

    };


    this.wsService.sendPrivateMessage(message)
    this.messageService.saveMessage(message)
    this.messageService.messageSentSubscription.next(message)
  }

}

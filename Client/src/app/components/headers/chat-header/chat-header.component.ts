import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {

  selectedUserName:string = ''
  msgCount:number = 0
  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userService.userClickSubscription.subscribe((UserDetail: any) => {
      console.log('Selected User:  ', UserDetail)
      this.selectedUserName = UserDetail.user.name
      this.msgCount = UserDetail.messages.length 
    })
  }

  toggleMenu(){
    //@ts-ignore
    document.getElementById("action_menu_id").classList.toggle('showMenu')
  }

}

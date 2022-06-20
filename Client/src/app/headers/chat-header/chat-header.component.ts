import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {

  userName:string = 'No User is Selected!'
  msgCount:number = 0
  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userService.userClickSubscription.subscribe((UserDetail: any) => {
      console.log('Selected User:  ', UserDetail)
      this.userName = UserDetail.user.name
    })
  }

}

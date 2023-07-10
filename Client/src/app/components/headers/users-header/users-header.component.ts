import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { WebsocketService } from '../../../services/websocket.service';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss']
})
export class UsersHeaderComponent implements OnInit {
  userName: string
  styles: any;

  constructor(
     private userService: UserService, 
    private wsService: WebsocketService,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.userName = this.wsService.getLoggedInUser().name
  }
  keyUp(event: KeyboardEvent) {
    const key = event.key; // const {key} = event; ES6+
    console.log('Key pressed: ',key)
    //@ts-ignore
    this.userService.userSearchSubscription.next(event.target.value);
}

}

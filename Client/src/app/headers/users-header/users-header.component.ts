import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss']
})
export class UsersHeaderComponent implements OnInit {

  constructor( private userService: UserService) { }

  ngOnInit(): void {
  }

  keyUp(event: KeyboardEvent) {
    const key = event.key; // const {key} = event; ES6+
    console.log('Key pressed: ',key)
    //@ts-ignore
    this.userService.userSearchSubscription.next(event.target.value);
}
}

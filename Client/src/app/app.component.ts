import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  scrolledToBottom = false;

  constructor(public authService: AuthService,
    private userService: UserService,
     private router: Router) { }

  ngOnInit() {
    this.userService.userClickSubscription.subscribe((user: any) => {
      this.scrolledToBottom = false;
    })
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if(!this.scrolledToBottom){
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
      
    } catch (err) {
      console.log('scrolling err: ', err)
     }
  }
   
   onScroll(){
    this.scrolledToBottom = true;
  }

}
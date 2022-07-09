import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './services/user.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  scrolledToBottom = false;
  isNavbarCollapsed = true;
  userName: string
  constructor(public authService: AuthService,
    private userService: UserService, private wsService: WebsocketService,
    private router: Router) { }

  ngOnInit() {
    this.userName = this.wsService.getLoggedInUser().name
    this.userService.userClickSubscription.subscribe((user: any) => {
      this.scrolledToBottom = false;
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (!this.scrolledToBottom) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }

    } catch (err) {
      console.log('scrolling err: ', err)
    }
  }

  onScroll() {
    this.scrolledToBottom = true;
  }

  toggleMenu() {
    //@ts-ignore
    document.getElementById("action_menu_id_own").classList.toggle('showMenu')
  }

  logout() {
    document.documentElement.style.setProperty(`--theme-background-color`, 'white');
    this.wsService.disconnect();
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-user-menu-bar',
  templateUrl: './user-menu-bar.component.html',
  styleUrls: ['./user-menu-bar.component.scss']
})
export class UserMenuBarComponent implements OnInit {
  userName: string
  styles: any;
  constructor(public authService: AuthService,
    private userService: UserService, private wsService: WebsocketService,
    private router: Router) { }


  ngOnInit(): void {
    this.userName = this.wsService.getLoggedInUser().name
  }

  toggleMenu() {
    //@ts-ignore
    document.getElementById("action_menu_id_own").classList.toggle('showMenu')
  }
  theme(themeBackgroundColor: string, theme: string,
    borderColorSecondary: string, iconColorSecondary: string,
    headerColor: string, searchInputColor: string,
    btnColor: string, textColor: string, activeColor: string,
    scrollTrack: string, scrollThumb: string, scrollBorder: string, notificationColor: string) {
  
    this.styles = [
      { name: 'theme-color', value: theme },
      { name: 'theme-border-color', value: borderColorSecondary },
      { name: 'theme-icon-color', value: iconColorSecondary },
      { name: 'theme-header-color', value: headerColor },
      { name: 'theme-search-color', value: searchInputColor },
      { name: 'theme-header-footer-btn-color', value: btnColor },
      { name: 'theme-active-color', value: activeColor },
      { name: 'theme-text-color', value: textColor },
      { name: 'theme-background-color', value: themeBackgroundColor },
  
      { name: 'theme-scrolltrack-color', value: scrollTrack },
      { name: 'theme-scrollthumb-color', value: scrollThumb },
      { name: 'theme-scrollborder-color', value: scrollBorder },
      { name: 'theme-notification-color', value: notificationColor },
  
    ];
  
    this.styles.forEach((data: any) => {
      document.documentElement.style.setProperty(`--${data.name}`, data.value);
    });
  
  }
  logout() {
    document.documentElement.style.setProperty(`--theme-background-color`, 'white');
    this.wsService.disconnect();
    this.authService.logout();
    this.router.navigate(['login']);
  }


}

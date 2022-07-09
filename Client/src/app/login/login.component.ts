import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { SignupService } from '../services/signup.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';
import { User } from 'src/app/user-list/user/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  styles: any
  userModel: User
  error: string

  name = 'Angular';
  maxDate = new Date();
  bsConfig = { showWeekNumbers: false, dateInputFormat: 'DD-MMM-YYYY' };
  registerForm: FormGroup;
  loginForm: FormGroup;

  constructor(public authService: AuthService, private wsService: WebsocketService,
    private register: SignupService, private router: Router, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.createRegisterForm()
    this.createLoginForm()
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      emailId: ['', Validators.compose([Validators.required,
      Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])],
      mobile: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')])],
      dob: ['', Validators.compose([Validators.required])]
    });
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      emailIdLogin: ['', Validators.compose([Validators.required,
      Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])],
      password: ['', Validators.compose([Validators.required])],

    });
  }


  get f() { return this.registerForm.controls; }
  get l() { return this.loginForm.controls; }

  registerFormSubmit(value: any) {
    this.onRegister(value)
  }

  loginFormSubmit(value: any) {
    this.onLogin(value)
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

  onRegister(postValue: any) {
    console.log('Registering...', postValue)
    this.userModel = {
      //@ts-ignore
      name: postValue.name,
      lastName: 'NA_LASTNAME',
      //@ts-ignore
      email: postValue.emailId,
      status: '',
      //@ts-ignore
      password: postValue.password,
      messages: '',
      createdAt: new Date(),
      //@ts-ignore
      description: 'NA_DESCRIPTION',
      selected: false,
      messageCount: 0,
      typing: false,
      //@ts-ignore
      phoneNumber: postValue.mobile,
      //@ts-ignore
      DOB: postValue.dob


    }
    // //@ts-ignore
    this.register.signup(this.userModel)
      .pipe(first())
      .subscribe(
        result => this.router.navigate(['login']),
        err => this.error = 'Could not sign up'
      )
  }

  onLogin(postValue: any) {
    document.documentElement.style.setProperty(`--theme-background-color`, '#075643');
    this.login(postValue)
  }

  public login(postValue:any) {
    // @ts-ignore
    this.authService.login(postValue.emailIdLogin, postValue.password)
      .subscribe((result) => {
        this.wsService.join()
        // this.user = this.wsService.getLoggedInUser()
      },
        (err) => { console.log(err) });
  }
}

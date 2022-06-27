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
  public username: string = '';
  public password: string = '';
  public error: string = '';
  signUp: FormGroup;
  loginn: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  userModel: User;
  styles: any

  constructor(public authService: AuthService, private wsService: WebsocketService,
    private register: SignupService, private router: Router, private formBuilder: FormBuilder) {
    this.signUp = this.formBuilder.group({
      name: ['', null],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      description: ['', Validators.requiredTrue]
    })

    this.loginn = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],

    })

  }

  ngOnInit() {
    this.createForm();
    this.setChangeValidate()
  }

  theme(themeBackgroundColor: string, primaryBGColor: string,
    borderColorSecondary: string, iconColorSecondary: string,
    headerColor: string, searchInputColor: string,
    btnColor: string, textColor: string, activeColor: string,
    scrollTrack: string, scrollThumb: string, scrollBorder: string, notificationColor: string) {

    this.styles = [
      { name: 'theme-bgcolor-primary', value: primaryBGColor },
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

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.signUp = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'name': [null, Validators.required],
      'password': [null, [Validators.required, this.checkPassword]],
      'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'validate': ''

    });
    this.loginn = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, [Validators.required, this.checkPassword]],
      'validate': ''

    });
  }

  setChangeValidate() {
    this.signUp.get('validate')!.valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.signUp.get('name')!.setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "You need to specify at least 3 characters";
        } else {
          this.signUp.get('name')!.setValidators(Validators.required);
        }
        this.signUp.get('name')!.updateValueAndValidity();
      }
    )
  }

  get name() {
    return this.signUp.get('name') as FormControl
  }

  checkPassword(control: any) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorEmail() {
    return this.signUp.get('email')!.hasError('required') ? 'Field is required' :
      this.signUp.get('email')!.hasError('pattern') ? 'Not a valid emailaddress' :
        this.signUp.get('email')!.hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorEmailLogin() {
    return this.loginn.get('email')!.hasError('required') ? 'Field is required' :
      this.loginn.get('email')!.hasError('pattern') ? 'Not a valid emailaddress' :
        this.loginn.get('email')!.hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.signUp.get('password')!.hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.signUp.get('password')!.hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  onRegister(post: any) {
    this.userModel = {
      //@ts-ignore
      name: this.signUp.get('name').value,
      lastName: '',
      username: '',
      //@ts-ignore
      email: this.signUp.get('email').value,
      status: '',
      //@ts-ignore
      password: this.signUp.get('password').value,
      messages: '',
      createdAt: new Date(),
      //@ts-ignore
      description: this.signUp.get('description').value,
      selected: false,
      messageCount: 0,
      typing: false

    }
    //@ts-ignore
    this.register.signup(this.userModel)
      .pipe(first())
      .subscribe(
        result => this.router.navigate(['login']),
        err => this.error = 'Could not sign up'
      )
  }

  onLogin(post: any) {
    // this.post = post;
    this.login()
  }
  public login() {
    //@ts-ignore
    this.authService.login(this.loginn.get('email').value, this.loginn.get('password').value)
      .pipe(first())
      .subscribe(
        result => this.wsService.join(),
        err => this.error = 'Could not authenticate'
      )
  }

  logout() {
    this.wsService.disconnect();
    this.authService.logout();
    this.router.navigate(['login']);
  }

}

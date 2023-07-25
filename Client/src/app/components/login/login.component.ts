import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  name = 'Angular';
  error: string
 
  loginForm: FormGroup;

  constructor(public authService: AuthService, private wsService: WebsocketService,
    private fb: FormBuilder) {

  }

  ngOnInit() {
    this.createLoginForm()
  }

  

  createLoginForm() {
    this.loginForm = this.fb.group({
      emailIdLogin: ['', Validators.compose([Validators.required,
      Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])],
      password: ['', Validators.compose([Validators.required])],

    });
  }

  get l() { return this.loginForm.controls; }

  

  loginFormSubmit(value: any) {
    this.onLogin(value)
  }

  onLogin(postValue: any) {
  //  document.documentElement.style.setProperty(`--theme-background-color`, '#075643');
    this.login(postValue)
  }

  public login(postValue:any) {
    // @ts-ignore
    this.authService.login(postValue.emailIdLogin, postValue.password)
    .pipe(first())
    .subscribe(
      result =>  this.wsService.join(),
      err => this.error = 'Login failed'
    ) 
  }
}

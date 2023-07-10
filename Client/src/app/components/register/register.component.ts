import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { User } from '../user-list/user/user';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  maxDate = new Date();
  constructor(private fb: FormBuilder, private register: SignupService,
     private router: Router, public authService: AuthService) { }
  bsConfig = { showWeekNumbers: false, dateInputFormat: 'DD-MMM-YYYY' };
  registerForm: FormGroup;
  userModel: User
  error: string
  result: string

  ngOnInit(): void {
    this.createRegisterForm()
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
  get f() { return this.registerForm.controls; }

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
      unreadMessageCount: 0,
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
        result => this.result = 'Registered Successfully!',
        err => this.error = 'Sign up failed'
      )
  }
  registerFormSubmit(value: any) {
    this.onRegister(value)
  }
}

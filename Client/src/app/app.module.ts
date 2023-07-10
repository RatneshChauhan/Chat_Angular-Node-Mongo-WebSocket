import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserComponent } from './components/user-list/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './auth.service';
import { SignupService } from './services/signup.service';
import { AuthGuard } from './auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ChatFooterComponent } from './components/footer/chat-footer.component';
import { ChatHeaderComponent } from './components/headers/chat-header/chat-header.component';
import { UsersHeaderComponent } from './components/headers/users-header/users-header.component';
import { SearchPipe } from './pipes/search.pipe';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { MyLoaderComponent } from './components/loader/my-loader.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegisterComponent } from './components/register/register.component';
import { UserMenuBarComponent } from './components/user-menu-bar/user-menu-bar.component';



export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserComponent,
    LoginComponent,
    MessageListComponent,
    ChatFooterComponent,
    ChatHeaderComponent,
    UsersHeaderComponent,
    SearchPipe,
    MyLoaderComponent,
    LandingPageComponent,
    RegisterComponent,
    UserMenuBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        //@ts-ignore
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['localhost:3000/api/auth']
      }
    }),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot()
  ],
  providers: [AuthService, SignupService, AuthGuard,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

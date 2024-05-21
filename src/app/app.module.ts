import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { UserService } from './user/user.service';
import { LocationComponent } from './location/location.component';
import { LocationService } from './location/location.service';
import { StoreComponent } from './store/store.component';
import { StoreService } from './store/store.service';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationService } from './reservation/reservation.service';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginService } from './login/login.service';
import { AuthInterceptorService } from './interceptors/auth.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LocationComponent,
    StoreComponent,
    HomeComponent,
    ReservationComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    UserService,
    LocationService,
    StoreService,
    ReservationService,
    LoginService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

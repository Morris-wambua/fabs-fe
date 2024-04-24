import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { UserService } from './user/user.service';
import { LocationComponent } from './location/location.component';
import { LocationService } from './location/location.service';
import { StoreComponent } from './store/store.component';
import { StoreService } from './store/store.service';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationService } from './reservation/reservation.service';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LocationComponent,
    StoreComponent,
    HomeComponent,
    ReservationComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [UserService, LocationService, StoreService, ReservationService],
  bootstrap: [AppComponent],
})
export class AppModule {}

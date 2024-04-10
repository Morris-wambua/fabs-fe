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

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LocationComponent,
    StoreComponent,
    HomeComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [UserService, LocationService, StoreService],
  bootstrap: [AppComponent],
})
export class AppModule {}

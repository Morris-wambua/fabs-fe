import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationService } from '../services/location.service';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store';
import { AppLocation } from '../models/appLocation';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  // create a parameter to hold the users
  public users: User[] = [];

  // create a constructor to call the userService
  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private storeService: StoreService
  ) {}

  // Override the OnInit
  ngOnInit() {
    this.getUsers(); // When this component is initialized, it will call this function
  }

  // create a function to get users
  public getUsers(): void {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        console.log(response);
        this.appendLocation();
        this.appendStore();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // change user.location from the uuid to name
  public appendLocation(): void {
    this.users.forEach((user) => {
      // call the locationService to get the location
      this.locationService.getById(user.userLocation).subscribe(
        (location: any) => {
          // Replace the UUID with the location name
          user.userLocation = location.name;
        },
        (error: HttpErrorResponse) => {
          console.log('Error fetching the location for user: ', user.firstName);
          alert(error.message);
        }
      );
    });
  }

  // change the user.store from uuid to name
  public appendStore(): void {
    this.users.forEach((user) => {
      // call the store service to get the store
      this.storeService.getById(user.userStore).subscribe(
        (store: any) => {
          // Replace the uuid with name
          user.userStore = store.name;
        },
        (error: HttpErrorResponse) => {
          console.log('Error fetching store for user: ', user.firstName);
          alert(error.message);
        }
      );
    });
  }
}

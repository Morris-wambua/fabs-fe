import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationService } from '../location/location.service';
import { StoreService } from '../store/store.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  // create a parameter to hold the users
  public users: User[] = [];
  public editUser!: User;
  public deleteUser!: User;

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

  // Add the search functionality
  public searchUsers(key: string): void {
    const results: User[] = [];

    // console.log(key);

    for (const user of this.users) {
      if (
        user.firstName.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !==
          -1 ||
        user.lastName.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !==
          -1 ||
        user.email.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !==
          -1 ||
        user.contact.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !==
          -1 ||
        user.userLocation
          .toLocaleLowerCase()
          .indexOf(key.toLocaleLowerCase()) !== -1 ||
        user.userStore.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !==
          -1
      ) {
        results.push(user);
      }
    }

    this.users = results; // append the users list with the newly found

    if (results.length === 0 || !key) {
      // If the key did not match any user or not truthy
      this.getUsers();
    }
  }

  // This will trigger the either the addUser, delete, or update modal
  public onOpenModal(user: User | any, mode: string): void {
    // first create button to trigger modal
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    // Added data-toggle attribute based on the mode
    if (mode === 'add') {
      button.setAttribute('data-target', '#addUserModal');
    }
    if (mode === 'edit') {
      this.editUser = user;
      button.setAttribute('data-target', '#updateUserModal');
    }
    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    }

    // add the button to the main component
    container?.appendChild(button);

    // click the button
    button.click();
  }

  // This will listen to addUser form submission and call the BE
  public onAddUser(addForm: NgForm): void {
    document.getElementById('add-user-form')?.click(); // This will click the close btn automatically
    this.userService.addUser(addForm.value).subscribe(
      (response: string) => {
        this.getUsers(); // Reload the users on the page
        addForm.reset(); // Flush the form for the next input
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
        alert(error.message);
        addForm.reset();
      }
    );
  }

  // This will listen to updateUser form submission and call the BE
  public onUpdateUser(user: User): void {
    this.userService.updateUser(user, this.editUser?.id).subscribe(
      (response: string) => {
        this.getUsers(); // Reload the users on the page
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
        alert(error.message);
      }
    );
  }

  // This will listen to updateUser form submission and call the BE
  public onDeleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      (response: void) => {
        this.getUsers(); // Reload the users on the page
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
        alert(error.message);
      }
    );
  }
}

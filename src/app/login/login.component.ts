import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Login } from './login';
import { LoginUser } from './LoginUser';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // declare an empty form
  loginDetails!: Login;
  loggedInUser!: LoginUser;
  usernameError: string = '';
  passwordError: string = '';

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(500),
      ]),
    });
  }

  onSubmit() {
    // Clear previous error messages
    this.usernameError = '';
    this.passwordError = '';

    if (this.loginForm.valid) {
      // Map the form data to login object
      this.loginDetails = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      };

      // Send the login obj to loginService
      this.loginService.initiateLogin(this.loginDetails).subscribe(
        (response: LoginUser) => {
          this.loggedInUser = response;
          console.log(response);

          // Save the token in local storage
          this.authService.setAuthToken(this.loggedInUser.token);

          // Save the login User
          this.authService.setUsername(this.loggedInUser.firstName);

          // update localStorage with the user and username
          this.authService.setName(this.loggedInUser.firstName);
          this.authService.setUsername(this.loggedInUser.login);

          // Redirect to the dashboard
          this.router.navigate(['api/reservations']);
        },
        (error: HttpErrorResponse) => {
          // Handle specific error statuses
          if (error.status === 404) {
            this.usernameError = "The user doesn't exist";
          } else if (error.status === 400) {
            this.passwordError = 'Wrong password*';
          } else {
            alert(error.message);
          }
        }
      );

      console.log('Form Submitted!', this.loginForm.get('username')?.value);
    } else {
      console.log('Form is invalid');
    }
  }
}

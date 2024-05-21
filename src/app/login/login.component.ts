import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Login } from './login';
import { LoginUser } from './LoginUser';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // declare an empty form
  loginDetails!: Login;
  loggedInUser!: LoginUser;

  constructor(private loginService: LoginService, private router: Router) {}

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

          // Redirect to the dashboard
          this.router.navigate(['api/users']);
        },
        (error: HttpErrorResponse) => {
          console.log('Sorry we could not log in the user: ', error.message);
          alert(error.message);
        }
      );

      console.log('Form Submitted!', this.loginForm.get('username')?.value);
    } else {
      console.log('Form is invalid');
    }
  }
}

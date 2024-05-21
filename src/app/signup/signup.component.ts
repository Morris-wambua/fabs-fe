import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SignupService } from './signup.service';
import { LoginUser } from '../login/LoginUser';
import { SignUpRequest } from './SignUpRequest';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup; // declare an empty form

  loggedInUser!: LoginUser;

  registrationData!: SignUpRequest;

  constructor(private signupService: SignupService) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(120),
        ]),
        passwordRepeat: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      this.passwordsMatchValidator
    );
  }

  /** Custom password validator */
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordRepeat = control.get('passwordRepeat');

    return password && passwordRepeat && password.value !== passwordRepeat.value
      ? { passwordsMismatch: true }
      : null;
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      // Map the form data to registration data
      this.registrationData = {
        firstName: this.signUpForm.get('firstName')?.value,
        lastName: this.signUpForm.get('lastName')?.value,
        username: this.signUpForm.get('username')?.value,
        password: this.signUpForm.get('passwordRepeat')?.value,
      };

      // Send the object to the backend
      this.signupService.register(this.registrationData).subscribe(
        (response: LoginUser) => {
          this.loggedInUser = response;
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.log(
            'Sorry we could not register your details: ',
            error.message
          );
          alert(error.message);
        }
      );

      console.log('Form Submitted!', this.signUpForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}

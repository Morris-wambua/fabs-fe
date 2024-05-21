import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup; // declare an empty form

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
      console.log('Form Submitted!', this.signUpForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}

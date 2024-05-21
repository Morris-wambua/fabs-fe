import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // Get Auth Token
  public getAuthToken(): string | null {
    return window.localStorage.getItem('auth_token');
  }

  // Save the Auth Token
  public setAuthToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem('auth_token', token);
    } else {
      window.localStorage.removeItem('auth_token');
    }
  }
}

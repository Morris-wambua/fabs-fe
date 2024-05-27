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

  public setName(name: string): void {
    if (name !== null) {
      window.localStorage.setItem('name', name);
    } else {
      window.localStorage.removeItem('name');
    }
  }

  public setUsername(username: string): void {
    if (username !== null) {
      window.localStorage.setItem('username', username);
    } else {
      window.localStorage.removeItem('username');
    }
  }
}

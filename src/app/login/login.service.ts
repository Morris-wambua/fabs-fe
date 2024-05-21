import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Login } from './login';
import { Observable } from 'rxjs';
import { LoginUser } from './LoginUser';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Initiate login
  public initiateLogin(login: Login): Observable<LoginUser> {
    return this.http.post<LoginUser>(`${this.apiServerUrl}/api/login`, login);
  }
}

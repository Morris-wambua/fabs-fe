import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { SignUpRequest } from './SignUpRequest';
import { Observable } from 'rxjs';
import { LoginUser } from '../login/LoginUser';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  //Register User
  public register(registerData: SignUpRequest): Observable<LoginUser> {
    return this.http.post<LoginUser>(
      `${this.apiServerUrl}/api/signup`,
      registerData
    );
  }
}

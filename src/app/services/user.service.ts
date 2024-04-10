import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root', // You have to do this or register it manually in the providers in main module
})
export class UserService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Get all Users
  public getUsers(): Observable<User[]> {
    let response = this.http.get<User[]>(`${this.apiServerUrl}/api/users`);
    console.log(response);
    return response;
  }

  // Get userById
  public getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/api/location/${id}`);
  }

  // Add a user
  public addUser(user: User): Observable<string> {
    return this.http.post<string>(`${this.apiServerUrl}/api/users`, user);
  }

  // Update a user
  public updateUser(user: User, id: string): Observable<string> {
    return this.http.put<string>(`${this.apiServerUrl}/api/users/${id}`, user);
  }

  // Delete a user
  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/api/users/${id}`);
  }
}

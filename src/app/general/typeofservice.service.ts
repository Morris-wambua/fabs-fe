import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeOfService } from './TypeOfService';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TypeofserviceService {
  constructor(private http: HttpClient) {}
  private apiBaseUrl = environment.apiBaseUrl;

  // Fetch all type of services(TOS)
  public getAllServices(): Observable<TypeOfService[]> {
    return this.http.get<TypeOfService[]>(
      `${this.apiBaseUrl}/api/typeOfServices`
    );
  }

  // Fetch TOS by Id
  public getService(id: string): Observable<TypeOfService> {
    return this.http.get<TypeOfService>(
      `${this.apiBaseUrl}/api/typeOfServices/${id}`
    );
  }

  // Add TOS
  public addService(service: TypeOfService): Observable<string> {
    return this.http.post<string>(
      `${this.apiBaseUrl}/api/typeOfServices`,
      service
    );
  }

  // Update TOS
  public updateService(id: string, service: TypeOfService): Observable<string> {
    return this.http.put<string>(
      `${this.apiBaseUrl}/api/typeOfServices/${id}`,
      service
    );
  }

  // Delete TOS
  public deleteService(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiBaseUrl}/api/typeOfServices/${id}`
    );
  }
}

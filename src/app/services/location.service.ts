import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AppLocation } from '../models/appLocation';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Fetch all locations
  public getLocations(): Observable<AppLocation[]> {
    return this.http.get<AppLocation[]>(`${this.apiServerUrl}/api/locations`);
  }

  // Fetch location byId
  public getById(id: string): Observable<AppLocation> {
    return this.http.get<AppLocation>(
      `${this.apiServerUrl}/api/locations/${id}`
    );
  }

  // Add location
  public addLocation(location: AppLocation): Observable<string> {
    return this.http.post<string>(
      `${this.apiServerUrl}/api/locations`,
      location
    );
  }

  // update location
  public updateLocation(location: AppLocation, id: string): Observable<string> {
    return this.http.put<string>(
      `${this.apiServerUrl}/api/locations/${id}`,
      location
    );
  }

  // deleteLocation
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/api/locations/${id}`);
  }
}

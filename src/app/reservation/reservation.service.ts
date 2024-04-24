import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Reservation } from './Reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Fetch all reservations
  public getReservations(): Observable<Reservation[]> {
    let response = this.http.get<Reservation[]>(
      `${this.apiBaseUrl}/api/reservations`
    );
    console.log(response);
    return response;
  }

  // Fetch reservation by Id
  public getReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(
      `${this.apiBaseUrl}/api/reservations/${id}`
    );
  }

  // Add reservation
  public addReservation(reservation: Reservation): Observable<string> {
    return this.http.post<string>(
      `${this.apiBaseUrl}/api/reservations`,
      reservation
    );
  }

  // Update reservation
  public updateReservation(
    id: string,
    reservation: Reservation
  ): Observable<string> {
    return this.http.put<string>(
      `${this.apiBaseUrl}/api/reservations/${id}`,
      reservation
    );
  }

  // Delete reservation
  public deleteReservation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/reservations/${id}`);
  }
}

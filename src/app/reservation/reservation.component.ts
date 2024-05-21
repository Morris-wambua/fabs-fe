import { Component, OnInit } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation } from './Reservation';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  public allReservations: Reservation[] = [];

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  public fetchReservations(): void {
    this.reservationService.getReservations().subscribe(
      (response: Reservation[]) => {
        this.allReservations = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        console.log(error.message);
      }
    );
  }

  public logout(): void {
    // Clear the auth token from local storage
    window.localStorage.removeItem('auth_token');

    // Redirect to home page
    this.router.navigate(['']);
  }
}

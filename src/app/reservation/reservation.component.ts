import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation } from './Reservation';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  public allReservations: Reservation[] = [];
  public isSidebarVisible: boolean = true;
  public user!: string;
  public username!: string;
  public reservationToDelete: Reservation | null = null;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchLoginUser();
  }

  public onOpenModal(reservation: Reservation | any, mode: string): void {
    console.log('open modal clicked');

    const container = document.getElementById('wrapper');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addUserModal');
    }
    if (mode === 'edit') {
      button.setAttribute('data-bs-target', '#updateUserModal');
    }
    if (mode === 'delete') {
      this.reservationToDelete = reservation;
      button.setAttribute('data-bs-target', '#deleteReservationModal');
    }

    container?.appendChild(button);
    button.click();
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

  public deleteReservation(id: string | undefined): void {
    if (id) {
      this.reservationService.deleteReservation(id).subscribe(
        (response: any) => {
          console.log(response);
          console.log('Reservation deleted successfully');
          this.fetchReservations();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          console.log(error.message);
        }
      );
    } else {
      console.error('Reservation ID is undefined');
    }
  }

  public toggleSideNav(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  public logout(): void {
    // Clear the auth token from local storage
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('username');

    // Redirect to home page
    this.router.navigate(['']);
  }

  public fetchLoginUser(): void {
    let fetchedUser = window.localStorage.getItem('name');
    let fetchedUsername = window.localStorage.getItem('username');
    if (fetchedUser !== null) {
      this.user = fetchedUser;
    } else {
      this.user = 'John Doe';
    }
    if (fetchedUsername !== null) {
      this.username = fetchedUsername;
    } else {
      this.username = 'john.doe@fabs.app';
    }
  }
}

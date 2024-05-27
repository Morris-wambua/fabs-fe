import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation } from './Reservation';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeOfService } from '../general/TypeOfService';
import { TypeofserviceService } from '../general/typeofservice.service';
import { tap } from 'rxjs';
import { StoreService } from '../store/store.service';
import { Store } from '../store/store';

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
  public addReservationForm!: FormGroup; // declare an empty form
  typeOfServices: TypeOfService[] = [];
  stores: Store[] = [];
  availableTimes: string[] = [];

  constructor(
    private reservationService: ReservationService,
    private tosService: TypeofserviceService,
    private storeService: StoreService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchLoginUser();
    this.initializeForm();
    this.fetchTypeOfServices();
    this.onReservationTypeChange();
    this.generateTimeOptions();
    this.fetchStores();
  }

  // This will initialize the add reservation form
  private initializeForm(): void {
    this.addReservationForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
      reservationDate: [''],
      startTime: [''],
      endTime: [''],
      expert: ['', Validators.required],
      store: ['', Validators.required],
      typeOfService: ['', Validators.required],
      reservationExpert: [{ value: '', disabled: true }, Validators.required],
      status: [''],
    });
  }

  // This controls any modals opening on the reservation page
  public onOpenModal(reservation: Reservation | any, mode: string): void {
    console.log('open modal clicked');

    const container = document.getElementById('wrapper');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addReservationModal');
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

  // Fetch all reservations
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

  // Delete reservation
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

  // Toggle side nav
  public toggleSideNav(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // handle log out event
  public logout(): void {
    // Clear the auth token from local storage
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('username');

    // Redirect to home page
    this.router.navigate(['']);
  }

  // Fetch the loggedIn user
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

  // Fetch Type of services
  public fetchTypeOfServices(): void {
    this.tosService
      .getAllServices()
      .pipe(
        tap((services: TypeOfService[]) => {
          this.typeOfServices = services;
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Error fetching type of services:', error);
        },
      });
  }

  // This will dynamically update the price based on the user's choice of type of service
  private onReservationTypeChange(): void {
    this.addReservationForm
      .get('name')
      ?.valueChanges.subscribe((selectedName) => {
        const selectedService = this.typeOfServices.find(
          (service) => service.name === selectedName
        );
        if (selectedService) {
          this.addReservationForm.get('price')?.setValue(selectedService.price);
        } else {
          this.addReservationForm.get('price')?.reset();
        }
      });
  }

  // Fetch Type of stores
  public fetchStores(): void {
    this.storeService
      .getAllStores()
      .pipe(
        tap((stores: Store[]) => {
          this.stores = stores;
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Error fetching stores:', error);
        },
      });
  }

  // Create chunks for available time
  private generateTimeOptions(): void {
    // Generate time options for a 24-hour clock
    for (let i = 0; i < 24; i++) {
      const time = `${i.toString().padStart(2, '0')}:00`; // Format as 'HH:00'
      this.availableTimes.push(time);
    }
  }
}

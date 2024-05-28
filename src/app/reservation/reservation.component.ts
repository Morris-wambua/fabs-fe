import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationStatus } from './Reservation';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeOfService } from '../general/TypeOfService';
import { TypeofserviceService } from '../general/typeofservice.service';
import { tap } from 'rxjs';
import { StoreService } from '../store/store.service';
import { Store } from '../store/store';
import { ExpertService } from '../expert/expert.service';
import { Expert } from '../expert/expert';

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
  public typeOfServices: TypeOfService[] = [];
  public stores: Store[] = [];
  public experts: Expert[] = [];
  public availableTimes: string[] = [];
  public reservationRequest!: Reservation;

  constructor(
    private reservationService: ReservationService,
    private tosService: TypeofserviceService,
    private storeService: StoreService,
    private expertService: ExpertService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchLoginUser();
    this.initializeForm();
    this.fetchTypeOfServices();
    this.onReservationTypeChange();
    this.fetchStores();
  }

  // This will initialize the add reservation form
  private initializeForm(): void {
    this.addReservationForm = this.fb.group({
      id: [''],
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

    this.onStoreChange();
    this.onExpertChange();
    this.onDateChange();
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

  // Listen dynamically for store change
  public onStoreChange(): void {
    this.addReservationForm
      .get('store')
      ?.valueChanges.subscribe((selectedStoreName) => {
        const selectedStore = this.stores.find(
          (store) => store.name === selectedStoreName
        );
        if (selectedStore) {
          this.fetchExpertsByStore(selectedStore.id);
        }
      });
  }

  // fetchExpertsByStore
  private fetchExpertsByStore(storeId: string): void {
    this.expertService
      .getExpertsByStore(storeId)
      .pipe(
        tap((experts: Expert[]) => {
          this.experts = experts;
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Error fetching experts:', error);
        },
      });
  }

  // Listen dynamically for expert change
  public onExpertChange(): void {
    this.addReservationForm
      .get('expert')
      ?.valueChanges.subscribe((selectedExpertName) => {
        const selectedExpert = this.experts.find(
          (expert) => expert.name === selectedExpertName
        );
        if (selectedExpert) {
          this.updateAvailableTimes(selectedExpert.id);
          this.addReservationForm
            .get('reservationExpert')
            ?.setValue(selectedExpert.id);
        }
      });
  }

  // Listen dynamically for date change
  public onDateChange(): void {
    this.addReservationForm
      .get('reservationDate')
      ?.valueChanges.subscribe(() => {
        const selectedExpertName = this.addReservationForm.get('expert')?.value;
        if (selectedExpertName) {
          const selectedExpert = this.experts.find(
            (expert) => expert.name === selectedExpertName
          );
          if (selectedExpert) {
            this.updateAvailableTimes(selectedExpert.id);
          }
        }
      });
  }

  // Update available time slots based on selected expert and date
  private updateAvailableTimes(expertId: string): void {
    const date = this.addReservationForm.get('reservationDate')?.value;

    if (expertId && date) {
      this.expertService.getAvailableTimeSlots(expertId, date).subscribe(
        (times: string[]) => {
          this.availableTimes = times;
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching available time slots:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.addReservationForm.valid) {
      let finalExpertId = '';
      const formExpertName = this.addReservationForm.get('expert')?.value;
      if (formExpertName) {
        const expertId = this.experts.find((ex) => ex.name === formExpertName);
        if (expertId) {
          finalExpertId = expertId.id;
        }
      }

      let finalTos = '';
      const nameValue = this.addReservationForm.get('name')?.value;
      if (nameValue) {
        const tos = this.typeOfServices.find((s) => s.name === nameValue);
        if (tos) {
          finalTos = tos.id;
        }
      }

      // Recompile the addReservation request
      this.reservationRequest = {
        id: '',
        name: this.addReservationForm.get('name')?.value,
        price: this.addReservationForm.get('price')?.value,
        reservationDate: this.addReservationForm.get('reservationDate')?.value,
        startTime: this.addReservationForm.get('startTime')?.value,
        endTime: this.addReservationForm.get('endTime')?.value,
        store: this.addReservationForm.get('store')?.value,
        typeOfService: '2a07f1e0-0f27-4f38-b801-c2d6fd486bcc',
        expert: finalExpertId,
        reservationExpert:
          this.addReservationForm.get('reservationExpert')?.value,
        status: ReservationStatus.IN_PROGRESS,
      };

      // Send the request to the backend
      this.reservationService.addReservation(this.reservationRequest).subscribe(
        (response: any) => {
          console.log('Reservation created successfully', response);
          this.fetchReservations();
        },
        (error: HttpErrorResponse) => {
          console.log('Error creating reservation:', error.message);
          alert(error.message);
        }
      );
    } else {
      console.log('The add reservation is invalid');
      this.logFormErrors(this.addReservationForm);
      alert('Invalid form');
    }
  }

  private logFormErrors(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const controlErrors = group.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((errorKey: string) => {
          console.log(
            `Key: ${key}, Error: ${errorKey}, Value: ${controlErrors[errorKey]}`
          );
        });
      }
      // If the control is a FormGroup, recursively log its errors
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.logFormErrors(control);
      }
    });
  }
}

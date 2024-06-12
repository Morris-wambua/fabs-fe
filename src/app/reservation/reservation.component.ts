import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationStatus } from './Reservation';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeOfService } from '../general/TypeOfService';
import { TypeofserviceService } from '../general/typeofservice.service';
import { of, switchMap, tap } from 'rxjs';
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
  public reservationToDelete!: Reservation;
  public reservationToCancel!: Reservation | null;
  public addReservationForm!: FormGroup; // declare an empty form
  public typeOfServices: TypeOfService[] = [];
  public groupedTypeOfServices: any = [];
  public stores: Store[] = [];
  public experts: Expert[] = [];
  public availableTimes: string[] = [];
  public reservationRequest!: Reservation;
  public canceledStatus = ReservationStatus.CANCELLED;

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
    this.onReservationTypeChange();
    this.fetchStores();
    this.fetchTypeOfServices();
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
    if (mode === 'cancel') {
      this.reservationToCancel = reservation;
      button.setAttribute('data-bs-target', '#cancelReservationModal');
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

  // Update reservation
  public updateReservationStatus(
    id: string,
    reservation: Reservation,
    status: ReservationStatus
  ) {
    if (reservation) {
      reservation.status = status;
      console.log('reservation to update: ', reservation);
      this.reservationService.updateReservation(id, reservation).subscribe(
        (response: any) => {
          console.log(response);
          this.fetchReservations();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          alert(error.message);
        }
      );
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
          this.groupTypeOfServices();
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Error fetching type of services:', error);
        },
      });
  }

  // group typeOfServices in chunks of 3
  public groupTypeOfServices() {
    console.log('Pushed TOS: called');
    console.log('tos:', this.typeOfServices);
    for (let i = 0; i < this.typeOfServices.length; i += 3) {
      const group = this.typeOfServices.slice(i, i + 3);
      if (group.length > 0) {
        this.groupedTypeOfServices.push(group);
      }
    }
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
          this.addReservationForm
            .get('typeOfService')
            ?.setValue(selectedService.id); // Ensure the typeOfService gets a value
        } else {
          this.addReservationForm.get('price')?.reset();
          this.addReservationForm.get('typeOfService')?.reset(); // Reset typeOfService if no service is selected
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
          console.log('Available slots: ', times);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          console.log(error.message);
        }
      );
    }
  }

  // get next hour
  public getNextHour(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const nextHour = hour === 23 ? 0 : hour + 1;
    return `${String(nextHour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}`;
  }

  public onSubmit(): void {
    if (this.addReservationForm.valid) {
      const formValues = this.addReservationForm.value;

      // 1. set endTime based on the startTime
      const startTime = formValues.startTime;
      const endTime = this.getNextHour(startTime);

      // 2. Convert store name to store ID
      const selectedStore = this.stores.find(
        (store) => store.name === formValues.store
      );
      const storeId = selectedStore ? selectedStore.id : null;

      // 3. Convert expert name to expert ID
      const selectedExpert = this.experts.find(
        (expert) => expert.name === formValues.expert
      );
      const expertId = selectedExpert ? selectedExpert.id : null;

      // 4. Convert type of service name to ID and fetch the price
      const selectedService = this.typeOfServices.find(
        (service) => service.name === formValues.name
      );
      const serviceId = selectedService ? selectedService.id : null;
      const price = selectedService ? selectedService.price : null;

      // Prepare the final reservation object
      const reservation: Reservation = {
        ...formValues,
        endTime: endTime,
        store: storeId,
        reservationExpert: expertId,
        status: ReservationStatus.BOOKED_PENDING_ACCEPTANCE,
        typeOfService: serviceId,
        price: price,
      };

      this.reservationService.addReservation(reservation).subscribe(
        (response: any) => {
          console.log('Reservation added successfully', response);
          this.fetchReservations();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          console.log(error.message);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}

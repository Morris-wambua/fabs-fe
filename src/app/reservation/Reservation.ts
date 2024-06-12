export interface Reservation {
  id: string;
  name: string;
  price: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  expert: string;
  store: string;
  typeOfService: string;
  reservationExpert: string;
  status: ReservationStatus;
}

export enum ReservationStatus {
  BOOKED_PENDING_ACCEPTANCE = 'BOOKED_PENDING_ACCEPTANCE',
  BOOKED_ACCEPTED = 'BOOKED_ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  SERVED = 'SERVED',
}

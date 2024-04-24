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
  BOOKED,
  IN_PROGRESS,
  CANCELLED,
  SERVED,
}

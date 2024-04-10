import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppLocation } from '../models/appLocation';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent {
  public locations: AppLocation[] = [];

  constructor(private locationService: LocationService) {}

  // fetchLocations
  public fetchLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations: AppLocation[]) => {
        console.log(locations);
        // Assign locations to a component property if needed
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching locations:', error);
        alert(error.message);
      }
    );
  }

  // FetchLocationById
  public fetchById(id: string): any {
    this.locationService.getById(id).subscribe(
      (location: AppLocation) => {
        return location;
      },
      (error: HttpErrorResponse) => {
        console.log('Error fetching location with id: ', id);
        alert(error.message);
      }
    );
  }
}

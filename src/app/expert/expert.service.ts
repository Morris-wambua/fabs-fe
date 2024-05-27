import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Expert } from './expert';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpertService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Fetch all experts
  public getExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>(`${this.apiServerUrl}/api/experts`);
  }

  // Fetch Expert byId
  public getById(id: string): Observable<Expert> {
    return this.http.get<Expert>(`${this.apiServerUrl}/api/experts/${id}`);
  }

  // Fetch Expert by storeId
  public getExpertsByStore(storeId: string): Observable<Expert[]> {
    return this.http.get<Expert[]>(
      `${this.apiServerUrl}/api/experts/store/${storeId}`
    );
  }

  // Add Expert
  public addLocation(expert: Expert): Observable<string> {
    return this.http.post<string>(`${this.apiServerUrl}/api/experts`, expert);
  }

  // update Expert
  public updateLocation(expert: Expert, id: string): Observable<string> {
    return this.http.put<string>(
      `${this.apiServerUrl}/api/experts/${id}`,
      expert
    );
  }

  // delete Expert
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/api/experts/${id}`);
  }
}

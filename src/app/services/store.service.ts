import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '../models/store';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiBaseurl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Get all stores
  public getAllStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiBaseurl}/api/stores`);
  }

  // Get store by Id
  public getById(id: string): Observable<Store> {
    return this.http.get<Store>(`${this.apiBaseurl}/api/stores/${id}`);
  }

  //Add store
  public addStore(store: Store): Observable<string> {
    return this.http.post<string>(`${this.apiBaseurl}/api/stores}`, store);
  }

  //Update store
  public updateStore(store: Store, id: string): Observable<string> {
    return this.http.put<string>(`${this.apiBaseurl}/api/stores/${id}}`, store);
  }

  //Delete store
  public deleteStore(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseurl}/api/stores/${id}}`);
  }
}

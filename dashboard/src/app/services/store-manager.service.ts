import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Store {
  id?: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  operatingHours?: Record<string, { open: string; close: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class StoreManagerService {
  private apiUrl = `${environment.apiUrl}/api/stores`;

  constructor(private http: HttpClient) { }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
  }

  getStoreById(id: string): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/${id}`);
  }

  createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, store);
  }

  updateStore(id: string, store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, store);
  }

  deleteStore(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStoreHours(id: string, hours: Record<string, { open: string; close: string }>): Observable<Store> {
    return this.http.patch<Store>(`${this.apiUrl}/${id}/hours`, { hours });
  }
}

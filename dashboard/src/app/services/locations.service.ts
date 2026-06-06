import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiService } from './api.service';

export interface Location {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  status: string;
  lat: number;
  lng: number;
  hasDriveThru: boolean;
  hasDelivery: boolean;
}

const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'Maadi Branch',          nameAr: 'فرع المعادي',          address: '12 Road 9, Maadi',             city: 'Cairo',       phone: '+20 2 2358 0000', hours: '6:00 AM – 11:00 PM', status: 'Open',   lat: 29.9602, lng: 31.2569, hasDriveThru: false, hasDelivery: true },
  { id: '2', name: 'Zamalek Branch',        nameAr: 'فرع الزمالك',          address: '26 Brazil St, Zamalek',        city: 'Cairo',       phone: '+20 2 2736 0000', hours: '7:00 AM – 12:00 AM', status: 'Open',   lat: 30.0622, lng: 31.2196, hasDriveThru: false, hasDelivery: true },
  { id: '3', name: 'New Cairo Branch',      nameAr: 'فرع القاهرة الجديدة',  address: 'Fifth Settlement, New Cairo',  city: 'Cairo',       phone: '+20 2 2617 0000', hours: '6:00 AM – 11:00 PM', status: 'Open',   lat: 30.0131, lng: 31.4710, hasDriveThru: true,  hasDelivery: true },
  { id: '4', name: 'Rehab City Branch',     nameAr: 'فرع مدينة الرحاب',    address: 'Rehab City Mall, Cairo',       city: 'Cairo',       phone: '+20 2 2688 0000', hours: '8:00 AM – 10:00 PM', status: 'Closed', lat: 30.0656, lng: 31.4913, hasDriveThru: false, hasDelivery: false },
  { id: '5', name: 'Alexandria Corniche',   nameAr: 'كورنيش الإسكندرية',   address: '27 Corniche El Nil, Alex',     city: 'Alexandria',  phone: '+20 3 4869 0000', hours: '7:00 AM – 12:00 AM', status: 'Open',   lat: 31.1975, lng: 29.8919, hasDriveThru: false, hasDelivery: true },
  { id: '6', name: 'City Stars Branch',    nameAr: 'فرع سيتي ستارز',      address: 'City Stars Mall, Nasr City',   city: 'Cairo',       phone: '+20 2 2480 0000', hours: '9:00 AM – 11:00 PM', status: 'Open',   lat: 30.0728, lng: 31.3386, hasDriveThru: false, hasDelivery: true },
  { id: '7', name: 'Heliopolis Branch',    nameAr: 'فرع مصر الجديدة',     address: '5 El Nozha St, Heliopolis',    city: 'Cairo',       phone: '+20 2 2291 0000', hours: '6:30 AM – 11:00 PM', status: 'Open',   lat: 30.0944, lng: 31.3272, hasDriveThru: true,  hasDelivery: true },
  { id: '8', name: 'Hurghada Marina',      nameAr: 'مارينا الغردقة',       address: 'Marina Blvd, Hurghada',        city: 'Hurghada',    phone: '+20 65 344 0000', hours: '8:00 AM – 11:00 PM', status: 'Open',   lat: 27.2578, lng: 33.8116, hasDriveThru: false, hasDelivery: false },
];

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private api = inject(ApiService);

  getLocations(): Observable<Location[]> {
    return this.api.get<any>('/locations').pipe(
      map(res => (res.items ?? res) as Location[]),
      catchError(() => of(MOCK_LOCATIONS))
    );
  }

  createLocation(location: Partial<Location>): Observable<Location> {
    return this.api.post<Location>('/admin/locations', location).pipe(
      catchError(() => of({ ...location, id: Date.now().toString() } as Location))
    );
  }

  updateLocation(id: string, location: Partial<Location>): Observable<Location> {
    return this.api.put<Location>(`/admin/locations/${id}`, location).pipe(
      catchError(() => of(location as Location))
    );
  }

  deleteLocation(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/locations/${id}`).pipe(
      catchError(() => of(undefined as unknown as void))
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MenuItem {
  id?: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  categoryId: string;
  image?: string;
  available: boolean;
}

export interface MenuCategory {
  id?: string;
  name: { en: string; ar: string };
  items?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuBuilderService {
  private apiUrl = `${environment.apiUrl}/api/menu`;

  constructor(private http: HttpClient) { }

  // Categories
  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category: MenuCategory): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: string, category: MenuCategory): Observable<MenuCategory> {
    return this.http.put<MenuCategory>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Items
  createItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/items`, item);
  }

  updateItem(id: string, item: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}`, item);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  toggleItemAvailability(id: string): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/items/${id}/toggle-availability`, {});
  }
}

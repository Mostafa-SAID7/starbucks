import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  emoji: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1',  name: 'Caramel Macchiato',     category: 'Coffee',      description: 'Espresso with vanilla and caramel',    price: 5.45,  stock: 120, status: 'Active',       emoji: '☕' },
  { id: '2',  name: 'Iced Latte',            category: 'Coffee',      description: 'Smooth espresso with cold milk',       price: 4.95,  stock: 95,  status: 'Active',       emoji: '🥤' },
  { id: '3',  name: 'Green Tea',             category: 'Tea',         description: 'Premium green tea blend',              price: 3.75,  stock: 80,  status: 'Active',       emoji: '🍵' },
  { id: '4',  name: 'Chocolate Croissant',   category: 'Food',        description: 'Buttery pastry with chocolate',        price: 3.95,  stock: 45,  status: 'Active',       emoji: '🥐' },
  { id: '5',  name: 'Cappuccino',            category: 'Coffee',      description: 'Classic Italian coffee',               price: 4.75,  stock: 0,   status: 'Out of Stock', emoji: '☕' },
  { id: '6',  name: 'Frappuccino',           category: 'Coffee',      description: 'Blended ice coffee drink',             price: 6.45,  stock: 150, status: 'Active',       emoji: '🥤' },
  { id: '7',  name: 'Matcha Latte',          category: 'Tea',         description: 'Japanese green tea latte',             price: 5.25,  stock: 70,  status: 'Active',       emoji: '🍵' },
  { id: '8',  name: 'Blueberry Muffin',      category: 'Food',        description: 'Fresh baked muffin',                  price: 3.50,  stock: 60,  status: 'Active',       emoji: '🧁' },
  { id: '9',  name: 'Espresso',              category: 'Coffee',      description: 'Strong Italian coffee',               price: 3.25,  stock: 200, status: 'Active',       emoji: '☕' },
  { id: '10', name: 'Travel Mug',            category: 'Merchandise', description: 'Insulated travel mug',                price: 24.95, stock: 35,  status: 'Active',       emoji: '🥤' },
  { id: '11', name: 'Chai Tea Latte',        category: 'Tea',         description: 'Spiced tea with milk',                price: 4.95,  stock: 85,  status: 'Active',       emoji: '🍵' },
  { id: '12', name: 'Bagel with Cream Cheese', category: 'Food',      description: 'Fresh bagel with cream cheese',       price: 4.25,  stock: 50,  status: 'Active',       emoji: '🥯' },
];

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private api = inject(ApiService);

  getProducts(): Observable<Product[]> {
    return this.api.get<any>('/admin/menu').pipe(
      map(res => {
        const items = res.items ?? res;
        return items.map((item: any) => ({
          id:          item.id ?? item.menuItemId ?? String(Math.random()),
          name:        item.name ?? item.title,
          category:    item.categoryName ?? item.category ?? 'Other',
          description: item.description ?? '',
          price:       item.price ?? 0,
          stock:       item.stockQuantity ?? item.stock ?? 0,
          status:      item.isAvailable === false ? 'Out of Stock' : 'Active',
          emoji:       item.emoji ?? '☕',
        }));
      }),
      catchError(() => of(MOCK_PRODUCTS))
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.api.post<Product>('/admin/menu/items', product).pipe(
      catchError(() => of({ ...product, id: Date.now().toString() } as Product))
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.api.put<Product>(`/admin/menu/items/${id}`, product).pipe(
      catchError(() => of(product as Product))
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/menu/items/${id}`).pipe(
      catchError(() => of(undefined as unknown as void))
    );
  }
}

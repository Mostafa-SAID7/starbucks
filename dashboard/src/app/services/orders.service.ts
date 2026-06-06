import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiService } from './api.service';

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  date: string;
}

export interface PagedOrders {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
}

const MOCK_ORDERS: Order[] = [
  { id: '1001', customer: 'Ahmed Hassan',   items: 3, total: 15.35, status: 'Completed',  date: '2026-06-06 10:30' },
  { id: '1002', customer: 'Sara Ali',       items: 2, total: 9.90,  status: 'Processing', date: '2026-06-06 11:15' },
  { id: '1003', customer: 'Omar Khaled',    items: 1, total: 3.25,  status: 'Completed',  date: '2026-06-06 11:45' },
  { id: '1004', customer: 'Fatima Nour',    items: 4, total: 22.80, status: 'Pending',    date: '2026-06-06 12:00' },
  { id: '1005', customer: 'Youssef Tarek',  items: 2, total: 12.90, status: 'Completed',  date: '2026-06-06 12:30' },
  { id: '1006', customer: 'Layla Mohamed',  items: 3, total: 18.45, status: 'Processing', date: '2026-06-06 13:00' },
  { id: '1007', customer: 'Karim Saad',     items: 1, total: 4.75,  status: 'Completed',  date: '2026-06-06 13:30' },
  { id: '1008', customer: 'Nour Ibrahim',   items: 5, total: 31.20, status: 'Completed',  date: '2026-06-06 14:00' },
  { id: '1009', customer: 'Amr Sherif',     items: 2, total: 11.90, status: 'Cancelled',  date: '2026-06-06 14:30' },
  { id: '1010', customer: 'Dina Mahmoud',   items: 3, total: 17.25, status: 'Pending',    date: '2026-06-06 15:00' },
];

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private api = inject(ApiService);

  getOrders(page = 1, pageSize = 20): Observable<PagedOrders> {
    return this.api.get<any>('/admin/orders', { pageNumber: page, pageSize }).pipe(
      map(res => ({
        items: res.items ?? res,
        total: res.total ?? (res.items ?? res).length,
        page: res.pageNumber ?? page,
        pageSize: res.pageSize ?? pageSize
      })),
      catchError(() => of({
        items: MOCK_ORDERS,
        total: MOCK_ORDERS.length,
        page: 1,
        pageSize: 20
      }))
    );
  }

  updateStatus(id: string, status: string): Observable<void> {
    return this.api.put<void>(`/admin/orders/${id}/status`, { status }).pipe(
      catchError(() => of(undefined as unknown as void))
    );
  }
}

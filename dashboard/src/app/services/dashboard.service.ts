import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  activeCustomers: number;
  customersChange: number;
  totalProducts: number;
  newProductsThisWeek: number;
}

export interface WeeklySale {
  day: string;
  amount: number;
  pct: number;
}

export interface CategorySale {
  name: string;
  pct: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

const MOCK_STATS: DashboardStats = {
  totalRevenue: 125420,
  revenueChange: 12.5,
  totalOrders: 1543,
  ordersChange: 8.2,
  activeCustomers: 2847,
  customersChange: 15.3,
  totalProducts: 156,
  newProductsThisWeek: 5
};

const MOCK_WEEKLY: WeeklySale[] = [
  { day: 'Mon', amount: 31000, pct: 45 },
  { day: 'Tue', amount: 40000, pct: 58 },
  { day: 'Wed', amount: 28000, pct: 40 },
  { day: 'Thu', amount: 51000, pct: 73 },
  { day: 'Fri', amount: 42000, pct: 60 },
  { day: 'Sat', amount: 82000, pct: 95 },
  { day: 'Sun', amount: 65000, pct: 75 },
];

const MOCK_CATEGORIES: CategorySale[] = [
  { name: 'Coffee',      pct: 44, color: 'bg-[#006241]' },
  { name: 'Tea',         pct: 35, color: 'bg-emerald-500' },
  { name: 'Food',        pct: 26, color: 'bg-emerald-400' },
  { name: 'Merchandise', pct: 11, color: 'bg-[#cba258]' },
];

const MOCK_ORDERS: RecentOrder[] = [
  { id: '1001', customer: 'Ahmed Hassan',  product: 'Caramel Macchiato', amount: 5.45, status: 'Completed',  date: '2026-06-06' },
  { id: '1002', customer: 'Sara Ali',      product: 'Iced Latte',         amount: 4.95, status: 'Processing', date: '2026-06-06' },
  { id: '1003', customer: 'Omar Khaled',   product: 'Espresso',           amount: 3.25, status: 'Completed',  date: '2026-06-06' },
  { id: '1004', customer: 'Fatima Nour',   product: 'Cappuccino',         amount: 4.75, status: 'Pending',    date: '2026-06-06' },
  { id: '1005', customer: 'Youssef Tarek', product: 'Frappuccino',        amount: 6.45, status: 'Completed',  date: '2026-06-06' },
];

const CAT_COLORS: Record<string, string> = {
  Coffee:      'bg-[#006241]',
  Tea:         'bg-emerald-500',
  Food:        'bg-emerald-400',
  Merchandise: 'bg-[#cba258]',
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(ApiService);

  getStats(): Observable<DashboardStats> {
    return this.api.get<DashboardStats>('/admin/analytics/dashboard').pipe(
      catchError(() => of(MOCK_STATS))
    );
  }

  getWeeklySales(): Observable<WeeklySale[]> {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return this.api.get<WeeklySale[]>('/admin/analytics/sales', {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    }).pipe(catchError(() => of(MOCK_WEEKLY)));
  }

  getCategories(): Observable<CategorySale[]> {
    return this.api.get<CategorySale[]>('/admin/analytics/menu-items').pipe(
      map(res => res.map(c => ({ ...c, color: CAT_COLORS[c.name] ?? 'bg-gray-400' }))),
      catchError(() => of(MOCK_CATEGORIES))
    );
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.api.get<{ items: RecentOrder[] }>('/admin/orders', { pageNumber: 1, pageSize: 5 }).pipe(
      map(res => res.items ?? (res as unknown as RecentOrder[])),
      catchError(() => of(MOCK_ORDERS))
    );
  }
}

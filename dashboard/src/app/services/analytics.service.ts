import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { ApiService } from './api.service';

export interface MonthlyRevenue {
  month: string;
  amount: number;
  pct: number;
}

export interface TopCustomer {
  id: number;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  avgOrder: number;
  lastOrder: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  customerRetention: number;
  revenueChange: number;
  avgOrderChange: number;
  conversionChange: number;
  retentionChange: number;
}

const MOCK_MONTHLY: MonthlyRevenue[] = [
  { month: 'Jan', amount: 28000, pct: 34 },
  { month: 'Feb', amount: 32000, pct: 39 },
  { month: 'Mar', amount: 38000, pct: 46 },
  { month: 'Apr', amount: 42000, pct: 51 },
  { month: 'May', amount: 55000, pct: 67 },
  { month: 'Jun', amount: 48000, pct: 58 },
  { month: 'Jul', amount: 62000, pct: 75 },
  { month: 'Aug', amount: 71000, pct: 86 },
  { month: 'Sep', amount: 65000, pct: 79 },
  { month: 'Oct', amount: 58000, pct: 70 },
  { month: 'Nov', amount: 82000, pct: 100 },
  { month: 'Dec', amount: 77000, pct: 94 },
];

const MOCK_CUSTOMERS: TopCustomer[] = [
  { id: 1, name: 'Ahmed Hassan',  email: 'ahmed@example.com',   orders: 47, totalSpent: 524.30, avgOrder: 11.15, lastOrder: '2026-06-05' },
  { id: 2, name: 'Sara Ali',      email: 'sara@example.com',    orders: 42, totalSpent: 487.90, avgOrder: 11.62, lastOrder: '2026-06-06' },
  { id: 3, name: 'Omar Khaled',   email: 'omar@example.com',    orders: 38, totalSpent: 445.20, avgOrder: 11.72, lastOrder: '2026-06-04' },
  { id: 4, name: 'Fatima Nour',   email: 'fatima@example.com',  orders: 35, totalSpent: 412.75, avgOrder: 11.79, lastOrder: '2026-06-06' },
  { id: 5, name: 'Youssef Tarek', email: 'youssef@example.com', orders: 32, totalSpent: 398.40, avgOrder: 12.45, lastOrder: '2026-06-05' },
];

const MOCK_SUMMARY: AnalyticsSummary = {
  totalRevenue:      325420,
  avgOrderValue:     15.87,
  conversionRate:    3.8,
  customerRetention: 82.4,
  revenueChange:     18.5,
  avgOrderChange:    5.2,
  conversionChange:  0.5,
  retentionChange:   -2.1,
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private api = inject(ApiService);

  getSummary(): Observable<AnalyticsSummary> {
    const year = new Date().getFullYear();
    return this.api.get<AnalyticsSummary>('/admin/analytics/dashboard').pipe(
      catchError(() => of(MOCK_SUMMARY))
    );
  }

  getMonthlyRevenue(year = new Date().getFullYear()): Observable<MonthlyRevenue[]> {
    return this.api.get<MonthlyRevenue[]>('/admin/analytics/sales', {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`
    }).pipe(catchError(() => of(MOCK_MONTHLY)));
  }

  getTopCustomers(): Observable<TopCustomer[]> {
    const year = new Date().getFullYear();
    return this.api.get<TopCustomer[]>('/admin/analytics/users', {
      startDate: `${year}-01-01`,
      endDate: new Date().toISOString().split('T')[0]
    }).pipe(catchError(() => of(MOCK_CUSTOMERS)));
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { ApiService } from './api.service';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
}

const MOCK_USERS: AdminUser[] = [
  { id: '1', name: 'Ahmed Hassan',   email: 'ahmed@example.com',   phone: '+20 100 123 4567', role: 'Customer',   status: 'Active',    ordersCount: 47, totalSpent: 524.30, joinedAt: '2025-01-15' },
  { id: '2', name: 'Sara Ali',       email: 'sara@example.com',    phone: '+20 101 234 5678', role: 'Customer',   status: 'Active',    ordersCount: 42, totalSpent: 487.90, joinedAt: '2025-02-20' },
  { id: '3', name: 'Omar Khaled',    email: 'omar@example.com',    phone: '+20 102 345 6789', role: 'Customer',   status: 'Active',    ordersCount: 38, totalSpent: 445.20, joinedAt: '2025-03-10' },
  { id: '4', name: 'Fatima Nour',    email: 'fatima@example.com',  phone: '+20 103 456 7890', role: 'Customer',   status: 'Disabled',  ordersCount: 12, totalSpent: 134.50, joinedAt: '2025-04-05' },
  { id: '5', name: 'Youssef Tarek',  email: 'youssef@example.com', phone: '+20 104 567 8901', role: 'Customer',   status: 'Active',    ordersCount: 32, totalSpent: 398.40, joinedAt: '2025-04-18' },
  { id: '6', name: 'Layla Mohamed',  email: 'layla@example.com',   phone: '+20 105 678 9012', role: 'Customer',   status: 'Active',    ordersCount: 28, totalSpent: 312.60, joinedAt: '2025-05-01' },
  { id: '7', name: 'Karim Saad',     email: 'karim@example.com',   phone: '+20 106 789 0123', role: 'Customer',   status: 'Active',    ordersCount: 19, totalSpent: 221.80, joinedAt: '2025-05-22' },
  { id: '8', name: 'Nour Ibrahim',   email: 'nour@example.com',    phone: '+20 107 890 1234', role: 'Customer',   status: 'Active',    ordersCount: 55, totalSpent: 641.20, joinedAt: '2025-06-01' },
  { id: '9', name: 'Admin User',     email: 'admin@starbucks.eg',  phone: '+20 100 000 0001', role: 'Admin',      status: 'Active',    ordersCount:  0, totalSpent:   0.00, joinedAt: '2024-12-01' },
  { id:'10', name: 'Super Admin',    email: 'super@starbucks.eg',  phone: '+20 100 000 0000', role: 'SuperAdmin', status: 'Active',    ordersCount:  0, totalSpent:   0.00, joinedAt: '2024-11-01' },
];

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = inject(ApiService);

  getUsers(search = '', role = ''): Observable<AdminUser[]> {
    const params: Record<string, string> = {};
    if (search) params['search'] = search;
    if (role)   params['role']   = role;
    return this.api.get<any>('/admin/users', params).pipe(
      map(res => (res.items ?? res) as AdminUser[]),
      catchError(() => of(MOCK_USERS))
    );
  }

  disableUser(id: string): Observable<void> {
    return this.api.post<void>(`/admin/users/${id}/disable`, {}).pipe(
      catchError(() => of(undefined as unknown as void))
    );
  }

  changeRole(id: string, role: string): Observable<void> {
    return this.api.post<void>(`/admin/users/${id}/role`, { role }).pipe(
      catchError(() => of(undefined as unknown as void))
    );
  }
}

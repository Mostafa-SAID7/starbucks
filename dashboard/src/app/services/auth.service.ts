import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

const TOKEN_KEY = 'sbx_admin_token';
const USER_KEY = 'sbx_admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _user = signal<AdminUser | null>(this.loadUser());
  user = this._user.asReadonly();
  isAuthenticated = computed(() => !!this.getToken());
  isDemoMode = computed(() => this.getToken() === 'demo');

  private loadUser(): AdminUser | null {
    try {
      const s = localStorage.getItem(USER_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._user.set(res.user);
      }),
      catchError(err => throwError(() => err))
    );
  }

  loginDemo(): void {
    const demoUser: AdminUser = {
      id: 'demo',
      name: 'Demo Admin',
      email: 'admin@starbucks.eg',
      role: 'SuperAdmin'
    };
    localStorage.setItem(TOKEN_KEY, 'demo');
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    this._user.set(demoUser);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}

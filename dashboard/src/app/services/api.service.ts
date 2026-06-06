import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<T>(`${this.base}${path}`, { params: httpParams }).pipe(
      timeout(8000),
      catchError(err => throwError(() => err))
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body).pipe(
      timeout(8000),
      catchError(err => throwError(() => err))
    );
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body).pipe(
      timeout(8000),
      catchError(err => throwError(() => err))
    );
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.base}${path}`, body).pipe(
      timeout(8000),
      catchError(err => throwError(() => err))
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`).pipe(
      timeout(8000),
      catchError(err => throwError(() => err))
    );
  }
}

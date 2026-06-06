import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'menu-builder',
    loadComponent: () => import('./pages/menu-builder/menu-builder.component').then(m => m.MenuBuilderComponent),
    canActivate: [authGuard]
  },
  {
    path: 'content',
    loadComponent: () => import('./pages/content/content.component').then(m => m.ContentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'stores',
    loadComponent: () => import('./pages/store-manager/store-manager.component').then(m => m.StoreManagerComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'locations',
    loadComponent: () => import('./pages/locations/locations.component').then(m => m.LocationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

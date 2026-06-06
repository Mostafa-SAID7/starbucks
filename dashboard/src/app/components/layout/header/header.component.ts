import { Component, Output, EventEmitter, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs';

const PAGE_MAP: Record<string, { label: string; icon: string }> = {
  '/dashboard': { label: 'Dashboard',  icon: 'layout-dashboard' },
  '/orders':    { label: 'Orders',     icon: 'shopping-bag' },
  '/products':  { label: 'Products',   icon: 'package' },
  '/users':     { label: 'Users',      icon: 'users' },
  '/locations': { label: 'Locations',  icon: 'map-pin' },
  '/analytics': { label: 'Analytics',  icon: 'chart-bar-big' },
  '/settings':  { label: 'Settings',   icon: 'settings' },
};

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();

  auth   = inject(AuthService);
  router = inject(Router);

  currentPage = { label: 'Dashboard', icon: 'layout-dashboard' };
  notifCount  = 4;
  today = new Date().toLocaleDateString('en-EG', { weekday: 'short', day: 'numeric', month: 'short' });

  userInitials = computed(() => {
    const name = this.auth.user()?.name ?? 'Admin';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  });

  ngOnInit() {
    this.updatePage(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.updatePage(e.urlAfterRedirects));
  }

  toggle() { this.menuToggle.emit(); }

  private updatePage(url: string) {
    const key = Object.keys(PAGE_MAP).find(k => url.startsWith(k));
    this.currentPage = key ? PAGE_MAP[key] : { label: 'Dashboard', icon: 'layout-dashboard' };
  }
}

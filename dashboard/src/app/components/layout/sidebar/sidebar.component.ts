import { Component, Input, Output, EventEmitter, signal, inject, computed, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from '../../../lucide-angular-shim.module';
import { AuthService } from '../../../services/auth.service';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  collapsed = signal(false);
  darkMode = signal(false);
  auth = inject(AuthService);

  ngOnInit() {
    const saved = localStorage.getItem('sb-theme');
    const prefersDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkMode.set(prefersDark);
    this.applyTheme(prefersDark);
  }

  toggleTheme() {
    const next = !this.darkMode();
    this.darkMode.set(next);
    this.applyTheme(next);
    localStorage.setItem('sb-theme', next ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark);
  }

  userInitials = computed(() => {
    const name = this.auth.user()?.name ?? 'Admin';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  });

  navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { path: '/orders',    label: 'Orders',    icon: 'shopping-bag' },
        { path: '/products',  label: 'Products',  icon: 'package' },
        { path: '/users',     label: 'Users',     icon: 'users' },
      ]
    },
    {
      title: 'Content',
      items: [
        { path: '/locations', label: 'Locations', icon: 'map-pin' },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { path: '/analytics', label: 'Analytics', icon: 'chart-bar-big' },
      ]
    },
    {
      title: 'System',
      items: [
        { path: '/settings',  label: 'Settings',  icon: 'settings' },
      ]
    },
  ];

  allItems = this.navSections.flatMap(s => s.items);

  toggleCollapse() { this.collapsed.update(v => !v); }
  close()          { this.closed.emit(); }
  logout()         { this.auth.logout(); }
  get themeIcon()  { return this.darkMode() ? 'sun' : 'moon'; }
}

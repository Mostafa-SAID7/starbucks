import { Component, Input, Output, EventEmitter, signal, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  collapsed = signal(false);
  auth = inject(AuthService);

  userInitials = computed(() => {
    const name = this.auth.user()?.name ?? 'Admin';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  });

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { path: '/orders',    label: 'Orders',    icon: 'shopping-bag' },
    { path: '/products',  label: 'Products',  icon: 'package' },
    { path: '/analytics', label: 'Analytics', icon: 'chart-bar-big' },
  ];

  toggleCollapse() { this.collapsed.update(v => !v); }
  close()          { this.closed.emit(); }
  logout()         { this.auth.logout(); }
}

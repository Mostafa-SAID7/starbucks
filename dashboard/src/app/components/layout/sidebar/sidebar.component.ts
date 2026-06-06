import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

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

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { path: '/orders',    label: 'Orders',    icon: 'shopping-bag' },
    { path: '/products',  label: 'Products',  icon: 'package' },
    { path: '/analytics', label: 'Analytics', icon: 'chart-bar-big' },
  ];

  toggleCollapse() {
    this.collapsed.update(v => !v);
  }

  close() {
    this.closed.emit();
  }
}

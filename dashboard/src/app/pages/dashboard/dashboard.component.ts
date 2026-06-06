import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = [
    { label: 'Total Revenue', value: '$125,420', change: '+12.5%', up: true, icon: 'dollar-sign', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Total Orders', value: '1,543', change: '+8.2%', up: true, icon: 'shopping-bag', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Active Customers', value: '2,847', change: '+15.3%', up: true, icon: 'users', bg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Products', value: '156', change: '5 new this week', up: true, icon: 'package', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  weeklySales = [
    { day: 'Mon', amount: '$31k', pct: 45 },
    { day: 'Tue', amount: '$40k', pct: 58 },
    { day: 'Wed', amount: '$28k', pct: 40 },
    { day: 'Thu', amount: '$51k', pct: 73 },
    { day: 'Fri', amount: '$42k', pct: 60 },
    { day: 'Sat', amount: '$82k', pct: 95 },
    { day: 'Sun', amount: '$65k', pct: 75 },
  ];

  categories = [
    { name: 'Coffee', pct: 44, color: 'bg-[#006241]' },
    { name: 'Tea', pct: 35, color: 'bg-emerald-500' },
    { name: 'Food', pct: 26, color: 'bg-emerald-400' },
    { name: 'Merchandise', pct: 11, color: 'bg-[#cba258]' },
  ];

  recentOrders = [
    { id: '1001', customer: 'John Doe', product: 'Caramel Macchiato', amount: 5.45, status: 'Completed', date: '2026-06-06' },
    { id: '1002', customer: 'Jane Smith', product: 'Iced Latte', amount: 4.95, status: 'Processing', date: '2026-06-06' },
    { id: '1003', customer: 'Mike Johnson', product: 'Espresso', amount: 3.25, status: 'Completed', date: '2026-06-06' },
    { id: '1004', customer: 'Sarah Williams', product: 'Cappuccino', amount: 4.75, status: 'Pending', date: '2026-06-06' },
    { id: '1005', customer: 'Tom Brown', product: 'Frappuccino', amount: 6.45, status: 'Completed', date: '2026-06-06' },
  ];

  ngOnInit(): void {}

  getStatusConfig(status: string): { classes: string; icon: string } {
    const map: Record<string, { classes: string; icon: string }> = {
      'Completed': { classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: 'check-circle' },
      'Processing': { classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200', icon: 'clock' },
      'Pending':    { classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', icon: 'alert-circle' },
      'Cancelled':  { classes: 'bg-red-50 text-red-700 ring-1 ring-red-200', icon: 'x-circle' },
    };
    return map[status] ?? { classes: 'bg-gray-100 text-gray-700', icon: 'clock' };
  }
}

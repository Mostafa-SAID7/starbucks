import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  metrics = [
    { label: 'Revenue', value: '$325,420', change: '+18.5%', up: true, icon: 'dollar-sign', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Avg. Order Value', value: '$15.87', change: '+5.2%', up: true, icon: 'shopping-cart', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Conversion Rate', value: '3.8%', change: '+0.5%', up: true, icon: 'trending-up', bg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Customer Retention', value: '82.4%', change: '-2.1%', up: false, icon: 'user-check', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  monthlyRevenue = [
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

  topCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 47, totalSpent: 524.30, avgOrder: 11.15, lastOrder: '2026-06-05' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 42, totalSpent: 487.90, avgOrder: 11.62, lastOrder: '2026-06-06' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 38, totalSpent: 445.20, avgOrder: 11.72, lastOrder: '2026-06-04' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', orders: 35, totalSpent: 412.75, avgOrder: 11.79, lastOrder: '2026-06-06' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', orders: 32, totalSpent: 398.40, avgOrder: 12.45, lastOrder: '2026-06-05' },
  ];

  ngOnInit(): void {}
}

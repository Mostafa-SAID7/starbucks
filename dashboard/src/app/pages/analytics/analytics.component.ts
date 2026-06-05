import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  metrics = {
    revenue: 325420,
    revenueGrowth: 18.5,
    avgOrderValue: 15.87,
    avgOrderValueGrowth: 5.2,
    conversionRate: 3.8,
    conversionRateGrowth: 0.5,
    retention: 82.4,
    retentionGrowth: 2.1
  };

  topCustomers = [
    { id: 1, name: 'John Doe', email: 'john&#64;example.com', initial: 'JD', orders: 47, totalSpent: 524.30, avgOrder: 11.15, lastOrder: '2026-06-05' },
    { id: 2, name: 'Jane Smith', email: 'jane&#64;example.com', initial: 'JS', orders: 42, totalSpent: 487.90, avgOrder: 11.62, lastOrder: '2026-06-06' },
    { id: 3, name: 'Mike Johnson', email: 'mike&#64;example.com', initial: 'MJ', orders: 38, totalSpent: 445.20, avgOrder: 11.72, lastOrder: '2026-06-04' },
    { id: 4, name: 'Sarah Williams', email: 'sarah&#64;example.com', initial: 'SW', orders: 35, totalSpent: 412.75, avgOrder: 11.79, lastOrder: '2026-06-06' },
    { id: 5, name: 'Tom Brown', email: 'tom&#64;example.com', initial: 'TB', orders: 32, totalSpent: 398.40, avgOrder: 12.45, lastOrder: '2026-06-05' },
  ];

  ngOnInit(): void {
    // Initialize data
  }
}

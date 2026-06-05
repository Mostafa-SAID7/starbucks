import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalSales: 125420,
    totalOrders: 1543,
    activeCustomers: 2847,
    totalProducts: 156
  };

  recentOrders = [
    { id: '1001', customer: 'John Doe', product: 'Caramel Macchiato', amount: 5.45, status: 'Completed', date: '2026-06-06' },
    { id: '1002', customer: 'Jane Smith', product: 'Iced Latte', amount: 4.95, status: 'Processing', date: '2026-06-06' },
    { id: '1003', customer: 'Mike Johnson', product: 'Espresso', amount: 3.25, status: 'Completed', date: '2026-06-06' },
    { id: '1004', customer: 'Sarah Williams', product: 'Cappuccino', amount: 4.75, status: 'Pending', date: '2026-06-06' },
    { id: '1005', customer: 'Tom Brown', product: 'Frappuccino', amount: 6.45, status: 'Completed', date: '2026-06-06' },
  ];

  ngOnInit(): void {
    // Initialize data
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Completed': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}

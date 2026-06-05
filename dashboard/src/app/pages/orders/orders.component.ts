import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders = [
    { id: '1001', customer: 'John Doe', items: 3, total: 15.35, status: 'Completed', date: '2026-06-06 10:30' },
    { id: '1002', customer: 'Jane Smith', items: 2, total: 9.90, status: 'Processing', date: '2026-06-06 11:15' },
    { id: '1003', customer: 'Mike Johnson', items: 1, total: 3.25, status: 'Completed', date: '2026-06-06 11:45' },
    { id: '1004', customer: 'Sarah Williams', items: 4, total: 22.80, status: 'Pending', date: '2026-06-06 12:00' },
    { id: '1005', customer: 'Tom Brown', items: 2, total: 12.90, status: 'Completed', date: '2026-06-06 12:30' },
    { id: '1006', customer: 'Emily Davis', items: 3, total: 18.45, status: 'Processing', date: '2026-06-06 13:00' },
    { id: '1007', customer: 'David Miller', items: 1, total: 4.75, status: 'Completed', date: '2026-06-06 13:30' },
    { id: '1008', customer: 'Lisa Anderson', items: 5, total: 31.20, status: 'Completed', date: '2026-06-06 14:00' },
    { id: '1009', customer: 'Robert Taylor', items: 2, total: 11.90, status: 'Cancelled', date: '2026-06-06 14:30' },
    { id: '1010', customer: 'Jennifer Wilson', items: 3, total: 17.25, status: 'Pending', date: '2026-06-06 15:00' },
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

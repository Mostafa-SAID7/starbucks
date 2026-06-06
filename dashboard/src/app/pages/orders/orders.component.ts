import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  search = '';
  statusFilter = '';

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

  get filtered() {
    return this.orders.filter(o =>
      (!this.search || o.customer.toLowerCase().includes(this.search.toLowerCase()) || o.id.includes(this.search)) &&
      (!this.statusFilter || o.status === this.statusFilter)
    );
  }

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

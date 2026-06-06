import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { OrdersService, Order } from '../../services/orders.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  loading = true;
  search = '';
  statusFilter = '';
  page = 1;
  pageSize = 20;
  total = 0;

  orders: Order[] = [];

  private svc = inject(OrdersService);

  get filtered() {
    return this.orders.filter(o =>
      (!this.search || o.customer.toLowerCase().includes(this.search.toLowerCase()) || o.id.includes(this.search)) &&
      (!this.statusFilter || o.status === this.statusFilter)
    );
  }

  get totalPages() { return Math.max(1, Math.ceil(this.total / this.pageSize)); }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getOrders(this.page, this.pageSize).subscribe({
      next: res => {
        this.orders = res.items;
        this.total  = res.total;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateStatus(id: string, status: string) {
    this.svc.updateStatus(id, status).subscribe(() => {
      const o = this.orders.find(x => x.id === id);
      if (o) o.status = status;
    });
  }

  getStatusConfig(status: string): { classes: string; icon: string } {
    const map: Record<string, { classes: string; icon: string }> = {
      Completed:  { classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: 'check-circle' },
      Processing: { classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',          icon: 'clock' },
      Pending:    { classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       icon: 'alert-circle' },
      Cancelled:  { classes: 'bg-red-50 text-red-700 ring-1 ring-red-200',             icon: 'x-circle' },
    };
    return map[status] ?? { classes: 'bg-gray-100 text-gray-700', icon: 'clock' };
  }
}

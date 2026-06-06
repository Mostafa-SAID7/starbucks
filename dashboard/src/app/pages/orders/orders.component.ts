import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from '../../lucide-angular-shim.module';
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
  dateFilter = '';
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

  get statusSummary() {
    return [
      { label: 'Pending',    value: 'Pending',    count: this.orders.filter(o => o.status === 'Pending').length,    icon: 'alert-circle', bg: 'bg-amber-50',   text: 'text-amber-600',   bar: 'bg-amber-400' },
      { label: 'Processing', value: 'Processing', count: this.orders.filter(o => o.status === 'Processing').length, icon: 'clock',        bg: 'bg-blue-50',    text: 'text-blue-600',    bar: 'bg-blue-400' },
      { label: 'Completed',  value: 'Completed',  count: this.orders.filter(o => o.status === 'Completed').length,  icon: 'check-circle', bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-400' },
      { label: 'Cancelled',  value: 'Cancelled',  count: this.orders.filter(o => o.status === 'Cancelled').length,  icon: 'x-circle',     bg: 'bg-red-50',     text: 'text-red-600',     bar: 'bg-red-400' },
    ];
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getOrders(this.page, this.pageSize).subscribe({
      next: res => { this.orders = res.items; this.total = res.total; this.loading = false; },
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
      Completed:  { classes: 'badge badge-success', icon: 'check-circle' },
      Processing: { classes: 'badge badge-info',    icon: 'clock' },
      Pending:    { classes: 'badge badge-warning', icon: 'alert-circle' },
      Cancelled:  { classes: 'badge badge-danger',  icon: 'x-circle' },
    };
    return map[status] ?? { classes: 'badge badge-muted', icon: 'clock' };
  }
}

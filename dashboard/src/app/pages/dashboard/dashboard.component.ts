import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { DashboardService, DashboardStats, WeeklySale, CategorySale, RecentOrder } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;

  stats: Array<{ label: string; value: string; change: string; up: boolean; icon: string; bg: string; iconColor: string }> = [];
  weeklySales: WeeklySale[] = [];
  categories: CategorySale[] = [];
  recentOrders: RecentOrder[] = [];

  private svc = inject(DashboardService);

  ngOnInit() {
    forkJoin({
      stats:  this.svc.getStats(),
      weekly: this.svc.getWeeklySales(),
      cats:   this.svc.getCategories(),
      orders: this.svc.getRecentOrders()
    }).subscribe({
      next: ({ stats, weekly, cats, orders }) => {
        this.stats       = this.mapStats(stats);
        this.weeklySales = weekly;
        this.categories  = cats;
        this.recentOrders = orders;
        this.loading     = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private mapStats(s: DashboardStats) {
    return [
      { label: 'Total Revenue',    value: `$${s.totalRevenue.toLocaleString()}`,    change: `+${s.revenueChange}%`,               up: true,                         icon: 'dollar-sign', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { label: 'Total Orders',     value: s.totalOrders.toLocaleString(),           change: `+${s.ordersChange}%`,                up: true,                         icon: 'shopping-bag', bg: 'bg-blue-50',   iconColor: 'text-blue-600' },
      { label: 'Active Customers', value: s.activeCustomers.toLocaleString(),       change: `+${s.customersChange}%`,             up: true,                         icon: 'users',        bg: 'bg-violet-50', iconColor: 'text-violet-600' },
      { label: 'Products',         value: s.totalProducts.toString(),               change: `${s.newProductsThisWeek} new this week`, up: s.newProductsThisWeek > 0, icon: 'package',      bg: 'bg-amber-50',  iconColor: 'text-amber-600' },
    ];
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

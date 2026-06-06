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
      Completed:  { classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: 'check-circle' },
      Processing: { classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',          icon: 'clock' },
      Pending:    { classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       icon: 'alert-circle' },
      Cancelled:  { classes: 'bg-red-50 text-red-700 ring-1 ring-red-200',             icon: 'x-circle' },
    };
    return map[status] ?? { classes: 'bg-gray-100 text-gray-700', icon: 'clock' };
  }
}

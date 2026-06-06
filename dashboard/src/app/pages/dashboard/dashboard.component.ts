import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from '../../lucide-angular-shim.module';
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

  stats: Array<{ label: string; value: string; change: string; up: boolean; icon: string; bg: string; iconColor: string; pct: number }> = [];
  weeklySales: WeeklySale[] = [];
  categories: Array<CategorySale & { dot: string }> = [];
  recentOrders: RecentOrder[] = [];

  private svc = inject(DashboardService);

  quickActions = [
    { label: 'New Order',    sub: 'Process a sale',      icon: 'shopping-bag',  path: '/orders',    iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
    { label: 'Add Product',  sub: 'Add to menu',         icon: 'package',       path: '/products',  iconBg: 'bg-violet-50',  iconColor: 'text-violet-600' },
    { label: 'Manage Users', sub: 'View accounts',       icon: 'users',         path: '/users',     iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Analytics',    sub: 'View full report',    icon: 'chart-bar-big', path: '/analytics', iconBg: 'bg-amber-50',   iconColor: 'text-amber-600' },
  ];

  topProducts = [
    { name: 'Caramel Macchiato',  orders: 1240, revenue: 48200, trend: 12,  iconBg: 'bg-sb-dark' },
    { name: 'Vanilla Frappuccino',orders: 1100, revenue: 42100, trend: 15,  iconBg: 'bg-sb-green' },
    { name: 'Matcha Latte',       orders:  890, revenue: 31500, trend: 8,   iconBg: 'bg-emerald-600' },
    { name: 'Spinach Wrap',       orders:  670, revenue: 18900, trend: -3,  iconBg: 'bg-orange-500' },
    { name: 'Green Tea Latte',    orders:  720, revenue: 22300, trend: 5,   iconBg: 'bg-teal-600' },
  ];

  get weeklyTotal(): number {
    return this.weeklySales.reduce((s, d) => s + d.amount, 0);
  }

  get maxDayPct(): number {
    return Math.max(...this.weeklySales.map(d => d.pct), 0);
  }

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
        this.categories  = this.enrichCategories(cats);
        this.recentOrders = orders;
        this.loading     = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private mapStats(s: DashboardStats) {
    return [
      { label: 'Total Revenue',    value: `EGP ${s.totalRevenue.toLocaleString()}`,  change: `${s.revenueChange}%`,            up: true,                        pct: 78, icon: 'dollar-sign',  bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { label: 'Total Orders',     value: s.totalOrders.toLocaleString(),            change: `${s.ordersChange}%`,             up: true,                        pct: 63, icon: 'shopping-bag', bg: 'bg-blue-50',    iconColor: 'text-blue-600' },
      { label: 'Active Customers', value: s.activeCustomers.toLocaleString(),        change: `${s.customersChange}%`,          up: true,                        pct: 55, icon: 'users',         bg: 'bg-violet-50',  iconColor: 'text-violet-600' },
      { label: 'Products',         value: s.totalProducts.toString(),                change: `${s.newProductsThisWeek} new`,   up: s.newProductsThisWeek > 0,   pct: 90, icon: 'package',       bg: 'bg-amber-50',   iconColor: 'text-amber-600' },
    ];
  }

  private enrichCategories(cats: CategorySale[]) {
    const dots: Record<string, string> = {
      Coffee: 'bg-sb-green', Tea: 'bg-emerald-400', Food: 'bg-orange-400', Merchandise: 'bg-violet-400'
    };
    return cats.map(c => ({ ...c, dot: dots[c.name] ?? 'bg-gray-400' }));
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

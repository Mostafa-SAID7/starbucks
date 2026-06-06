import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from '../../lucide-angular-shim.module';
import { forkJoin } from 'rxjs';
import { AnalyticsService, MonthlyRevenue, TopCustomer, AnalyticsSummary } from '../../services/analytics.service';

interface EnrichedMonth extends MonthlyRevenue {
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  loading = true;

  summary: AnalyticsSummary | null = null;
  monthlyRevenue: EnrichedMonth[] = [];
  topCustomers: TopCustomer[] = [];

  metrics: Array<{ label: string; value: string; change: string; up: boolean; icon: string; bg: string; iconColor: string }> = [];

  private svc = inject(AnalyticsService);

  categoryBreakdown = [
    { name: 'Coffee',      pct: 52, amount: 972, dot: 'bg-sb-dark',     color: 'bg-sb-green' },
    { name: 'Food',        pct: 24, amount: 449, dot: 'bg-orange-400',  color: 'bg-orange-400' },
    { name: 'Tea',         pct: 16, amount: 299, dot: 'bg-emerald-400', color: 'bg-emerald-400' },
    { name: 'Merchandise', pct:  8, amount: 150, dot: 'bg-violet-400',  color: 'bg-violet-400' },
  ];

  topProducts = [
    { name: 'Caramel Macchiato',   iconBg: 'bg-sb-dark',     revenue: 48200, trend: 12, pct: 100 },
    { name: 'Vanilla Frappuccino', iconBg: 'bg-sb-green',    revenue: 42100, trend: 15, pct: 87 },
    { name: 'Matcha Latte',        iconBg: 'bg-emerald-600', revenue: 31500, trend: 8,  pct: 65 },
    { name: 'Spinach Wrap',        iconBg: 'bg-orange-500',  revenue: 22300, trend: -3, pct: 46 },
    { name: 'Green Tea Latte',     iconBg: 'bg-teal-600',    revenue: 18900, trend: 5,  pct: 39 },
  ];

  ngOnInit() {
    forkJoin({
      summary:   this.svc.getSummary(),
      monthly:   this.svc.getMonthlyRevenue(),
      customers: this.svc.getTopCustomers(),
    }).subscribe({
      next: ({ summary, monthly, customers }) => {
        this.summary      = summary;
        this.topCustomers = customers;
        this.metrics      = this.buildMetrics(summary);
        this.monthlyRevenue = monthly.map((m, i) => ({
          ...m,
          isCurrentMonth: i === monthly.length - 1,
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private buildMetrics(s: AnalyticsSummary) {
    return [
      { label: 'Total Revenue',      value: `EGP ${s.totalRevenue.toLocaleString()}`, change: `+${s.revenueChange}%`,    up: s.revenueChange >= 0,    icon: 'dollar-sign',   bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { label: 'Avg. Order Value',   value: `EGP ${s.avgOrderValue.toFixed(0)}`,      change: `+${s.avgOrderChange}%`,   up: s.avgOrderChange >= 0,   icon: 'shopping-cart', bg: 'bg-blue-50',    iconColor: 'text-blue-600' },
      { label: 'Conversion Rate',    value: `${s.conversionRate}%`,                   change: `+${s.conversionChange}%`, up: s.conversionChange >= 0, icon: 'trending-up',   bg: 'bg-violet-50',  iconColor: 'text-violet-600' },
      { label: 'Customer Retention', value: `${s.customerRetention}%`,               change: `${s.retentionChange}%`,   up: s.retentionChange >= 0,  icon: 'user-check',    bg: 'bg-amber-50',   iconColor: 'text-amber-600' },
    ];
  }
}

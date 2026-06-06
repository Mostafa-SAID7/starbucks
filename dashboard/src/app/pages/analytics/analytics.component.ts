import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { AnalyticsService, MonthlyRevenue, TopCustomer, AnalyticsSummary } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  loading = true;

  summary: AnalyticsSummary | null = null;
  monthlyRevenue: MonthlyRevenue[] = [];
  topCustomers: TopCustomer[] = [];

  metrics: Array<{ label: string; value: string; change: string; up: boolean; icon: string; bg: string; iconColor: string }> = [];

  private svc = inject(AnalyticsService);

  ngOnInit() {
    forkJoin({
      summary:  this.svc.getSummary(),
      monthly:  this.svc.getMonthlyRevenue(),
      customers: this.svc.getTopCustomers()
    }).subscribe({
      next: ({ summary, monthly, customers }) => {
        this.summary       = summary;
        this.monthlyRevenue = monthly;
        this.topCustomers  = customers;
        this.metrics       = this.buildMetrics(summary);
        this.loading       = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private buildMetrics(s: AnalyticsSummary) {
    return [
      { label: 'Total Revenue',      value: `$${s.totalRevenue.toLocaleString()}`,   change: `+${s.revenueChange}%`,    up: s.revenueChange >= 0,    icon: 'dollar-sign',  bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { label: 'Avg. Order Value',   value: `$${s.avgOrderValue.toFixed(2)}`,         change: `+${s.avgOrderChange}%`,   up: s.avgOrderChange >= 0,   icon: 'shopping-cart', bg: 'bg-blue-50',   iconColor: 'text-blue-600' },
      { label: 'Conversion Rate',    value: `${s.conversionRate}%`,                   change: `+${s.conversionChange}%`, up: s.conversionChange >= 0, icon: 'trending-up',  bg: 'bg-violet-50', iconColor: 'text-violet-600' },
      { label: 'Customer Retention', value: `${s.customerRetention}%`,               change: `${s.retentionChange}%`,   up: s.retentionChange >= 0,  icon: 'user-check',   bg: 'bg-amber-50',  iconColor: 'text-amber-600' },
    ];
  }
}

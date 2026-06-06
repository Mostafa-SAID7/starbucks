import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductsService, Product } from '../../services/products.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  loading = false;
  search = '';
  categoryFilter = '';
  statusFilter = '';
  products: Product[] = [];

  private svc = inject(ProductsService);

  get filtered() {
    return this.products.filter(p =>
      (!this.search || p.name.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.categoryFilter || p.category === this.categoryFilter) &&
      (!this.statusFilter || p.status === this.statusFilter)
    );
  }

  get categorySummary() {
    const cats = ['Coffee', 'Tea', 'Food', 'Merchandise'];
    const bgs: Record<string, string> = { Coffee: 'bg-sb-dark', Tea: 'bg-emerald-600', Food: 'bg-orange-500', Merchandise: 'bg-violet-600' };
    return cats.map(name => ({
      name,
      bg: bgs[name] ?? 'bg-gray-500',
      count: this.products.filter(p => p.category === name).length
    }));
  }

  ngOnInit() {
    this.svc.getProducts().subscribe({
      next: products => { this.products = products; this.loading = false; },
      error: ()       => { this.loading = false; }
    });
  }

  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.svc.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(p => p.id !== id);
    });
  }

  getProductGradient(category: string): string {
    const map: Record<string, string> = {
      Coffee:      'bg-gradient-to-br from-[#1e3932] to-[#006241]',
      Tea:         'bg-gradient-to-br from-emerald-600 to-emerald-800',
      Food:        'bg-gradient-to-br from-orange-500 to-orange-700',
      Merchandise: 'bg-gradient-to-br from-violet-500 to-violet-700',
    };
    return map[category] ?? 'bg-gradient-to-br from-gray-500 to-gray-700';
  }

  getStatusConfig(status: string): string {
    const map: Record<string, string> = {
      Active:         'badge-sm badge-success',
      'Out of Stock': 'badge-sm badge-danger',
      Inactive:       'badge-sm badge-muted',
    };
    return map[status] ?? 'badge-sm badge-muted';
  }

  getStockBadge(stock: number): string {
    if (stock === 0) return 'badge-sm badge-danger';
    if (stock < 10)  return 'badge-sm badge-warning';
    return 'badge-sm badge-muted';
  }

  getStockBarColor(stock: number): string {
    if (stock === 0) return 'bg-red-400';
    if (stock < 10)  return 'bg-amber-400';
    if (stock < 30)  return 'bg-sb-green/60';
    return 'bg-sb-green';
  }

  getStockPct(stock: number): number {
    if (stock === 0) return 0;
    return Math.min(100, Math.round((stock / 100) * 100));
  }

  getCategoryColor(cat: string): string {
    const map: Record<string, string> = {
      Coffee:      'bg-amber-50 text-amber-700',
      Tea:         'bg-emerald-50 text-emerald-700',
      Food:        'bg-orange-50 text-orange-700',
      Merchandise: 'bg-violet-50 text-violet-700',
    };
    return map[cat] ?? 'bg-gray-50 text-gray-600';
  }
}

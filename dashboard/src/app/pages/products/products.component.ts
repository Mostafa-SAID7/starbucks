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
  loading = true;
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

  getStatusConfig(status: string): string { return this.getStatusClass(status); }
  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Active:          'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      'Out of Stock':  'bg-red-50 text-red-700 ring-1 ring-red-200',
      Inactive:        'bg-gray-100 text-gray-600',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
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

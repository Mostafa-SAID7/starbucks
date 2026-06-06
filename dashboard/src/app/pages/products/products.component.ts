import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  search = '';
  categoryFilter = '';
  statusFilter = '';

  products = [
    { id: 1, name: 'Caramel Macchiato', category: 'Coffee', description: 'Espresso with vanilla and caramel', price: 5.45, stock: 120, status: 'Active', emoji: '☕' },
    { id: 2, name: 'Iced Latte', category: 'Coffee', description: 'Smooth espresso with cold milk', price: 4.95, stock: 95, status: 'Active', emoji: '🥤' },
    { id: 3, name: 'Green Tea', category: 'Tea', description: 'Premium green tea blend', price: 3.75, stock: 80, status: 'Active', emoji: '🍵' },
    { id: 4, name: 'Chocolate Croissant', category: 'Food', description: 'Buttery pastry with chocolate', price: 3.95, stock: 45, status: 'Active', emoji: '🥐' },
    { id: 5, name: 'Cappuccino', category: 'Coffee', description: 'Classic Italian coffee', price: 4.75, stock: 0, status: 'Out of Stock', emoji: '☕' },
    { id: 6, name: 'Frappuccino', category: 'Coffee', description: 'Blended ice coffee drink', price: 6.45, stock: 150, status: 'Active', emoji: '🥤' },
    { id: 7, name: 'Matcha Latte', category: 'Tea', description: 'Japanese green tea latte', price: 5.25, stock: 70, status: 'Active', emoji: '🍵' },
    { id: 8, name: 'Blueberry Muffin', category: 'Food', description: 'Fresh baked muffin', price: 3.50, stock: 60, status: 'Active', emoji: '🧁' },
    { id: 9, name: 'Espresso', category: 'Coffee', description: 'Strong Italian coffee', price: 3.25, stock: 200, status: 'Active', emoji: '☕' },
    { id: 10, name: 'Travel Mug', category: 'Merchandise', description: 'Insulated travel mug', price: 24.95, stock: 35, status: 'Active', emoji: '🥤' },
    { id: 11, name: 'Chai Tea Latte', category: 'Tea', description: 'Spiced tea with milk', price: 4.95, stock: 85, status: 'Active', emoji: '🍵' },
    { id: 12, name: 'Bagel with Cream Cheese', category: 'Food', description: 'Fresh bagel with cream cheese', price: 4.25, stock: 50, status: 'Active', emoji: '🥯' },
  ];

  get filtered() {
    return this.products.filter(p =>
      (!this.search || p.name.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.categoryFilter || p.category === this.categoryFilter) &&
      (!this.statusFilter || p.status === this.statusFilter)
    );
  }

  ngOnInit(): void {}

  getStatusConfig(status: string): string {
    const map: Record<string, string> = {
      'Active': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      'Out of Stock': 'bg-red-50 text-red-700 ring-1 ring-red-200',
      'Inactive': 'bg-gray-100 text-gray-600',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  getCategoryColor(cat: string): string {
    const map: Record<string, string> = {
      'Coffee': 'bg-amber-50 text-amber-700',
      'Tea': 'bg-emerald-50 text-emerald-700',
      'Food': 'bg-orange-50 text-orange-700',
      'Merchandise': 'bg-violet-50 text-violet-700',
    };
    return map[cat] ?? 'bg-gray-50 text-gray-600';
  }
}

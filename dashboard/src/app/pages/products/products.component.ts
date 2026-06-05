import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products = [
    { id: 1, name: 'Caramel Macchiato', category: 'Coffee', description: 'Espresso with vanilla and caramel', price: 5.45, stock: 120, status: 'Active', icon: '☕' },
    { id: 2, name: 'Iced Latte', category: 'Coffee', description: 'Smooth espresso with cold milk', price: 4.95, stock: 95, status: 'Active', icon: '🥤' },
    { id: 3, name: 'Green Tea', category: 'Tea', description: 'Premium green tea blend', price: 3.75, stock: 80, status: 'Active', icon: '🍵' },
    { id: 4, name: 'Chocolate Croissant', category: 'Food', description: 'Buttery pastry with chocolate', price: 3.95, stock: 45, status: 'Active', icon: '🥐' },
    { id: 5, name: 'Cappuccino', category: 'Coffee', description: 'Classic Italian coffee', price: 4.75, stock: 0, status: 'Out of Stock', icon: '☕' },
    { id: 6, name: 'Frappuccino', category: 'Coffee', description: 'Blended ice coffee drink', price: 6.45, stock: 150, status: 'Active', icon: '🥤' },
    { id: 7, name: 'Matcha Latte', category: 'Tea', description: 'Japanese green tea latte', price: 5.25, stock: 70, status: 'Active', icon: '🍵' },
    { id: 8, name: 'Blueberry Muffin', category: 'Food', description: 'Fresh baked muffin', price: 3.50, stock: 60, status: 'Active', icon: '🧁' },
    { id: 9, name: 'Espresso', category: 'Coffee', description: 'Strong Italian coffee', price: 3.25, stock: 200, status: 'Active', icon: '☕' },
    { id: 10, name: 'Travel Mug', category: 'Merchandise', description: 'Insulated travel mug', price: 24.95, stock: 35, status: 'Active', icon: '🥤' },
    { id: 11, name: 'Chai Tea Latte', category: 'Tea', description: 'Spiced tea with milk', price: 4.95, stock: 85, status: 'Active', icon: '🍵' },
    { id: 12, name: 'Bagel with Cream Cheese', category: 'Food', description: 'Fresh bagel with cream cheese', price: 4.25, stock: 50, status: 'Active', icon: '🥯' },
  ];

  ngOnInit(): void {
    // Initialize data
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Out of Stock': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}

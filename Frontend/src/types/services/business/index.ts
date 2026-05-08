/**
 * Business Domain Service Types
 * Service interfaces for business logic (Menu, Orders, Locations)
 */

import type { ServiceResponse, PaginatedResponse, PaginationParams } from '../base';
import type {
  MenuCategory,
  MenuItem,
  Location,
  Order,
  OrderItem,
  OrderStatus,
} from '../../data';

export interface MenuService {
  getCategories(): Promise<ServiceResponse<MenuCategory[]>>;
  getCategory(id: string): Promise<ServiceResponse<MenuCategory>>;
  getItem(id: string): Promise<ServiceResponse<MenuItem>>;
  search(query: string, filters?: MenuFilters): Promise<ServiceResponse<MenuItem[]>>;
}

export interface MenuFilters {
  category?: string;
  priceRange?: [number, number];
  dietary?: string[];
  availability?: boolean;
}

export interface LocationService {
  getAll(): Promise<ServiceResponse<Location[]>>;
  getById(id: string): Promise<ServiceResponse<Location>>;
  getNearby(lat: number, lng: number, radius?: number): Promise<ServiceResponse<Location[]>>;
  getByCity(city: string): Promise<ServiceResponse<Location[]>>;
}

export interface OrderService {
  create(order: CreateOrderRequest): Promise<ServiceResponse<Order>>;
  getById(id: string): Promise<ServiceResponse<Order>>;
  getHistory(userId: string, pagination?: PaginationParams): Promise<PaginatedResponse<Order>>;
  updateStatus(id: string, status: OrderStatus): Promise<ServiceResponse<Order>>;
  cancel(id: string, reason?: string): Promise<ServiceResponse<void>>;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  locationId: string;
  orderType: 'pickup' | 'delivery';
  paymentMethod: string;
  specialInstructions?: string;
  scheduledTime?: string;
}
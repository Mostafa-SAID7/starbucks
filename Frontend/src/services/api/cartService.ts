import { ApiService } from './ApiService';

export interface CartItemDto {
  menuItemId: string;
  variantId?: string;
  quantity: number;
  customizations?: any;
}

export interface CartDto {
  items: CartItemDto[];
  totalAmount: number;
}

export class CartService extends ApiService {
  private static instance: CartService;

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  public async getCart(): Promise<CartDto> {
    return this.get<CartDto>('/cart');
  }

  public async addToCart(item: CartItemDto): Promise<CartDto> {
    return this.post<CartDto>('/cart/items', item);
  }

  public async updateQuantity(menuItemId: string, quantity: number): Promise<CartDto> {
    return this.put<CartDto>(`/cart/items/${menuItemId}`, { quantity });
  }

  public async removeFromCart(menuItemId: string): Promise<CartDto> {
    return this.delete<CartDto>(`/cart/items/${menuItemId}`);
  }

  public async clearCart(): Promise<void> {
    return this.delete<void>('/cart');
  }
}

export const cartService = CartService.getInstance();

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { cartService } from '@/services/api/cartService';
import { useAuth } from '@/hooks/auth/useAuth';

export const useCart = () => {
  const { user } = useAuth();
  const { items, clearCart, addItem } = useCartStore();

  // Sync with backend on login
  useEffect(() => {
    if (user) {
      const syncCart = async () => {
        try {
          const backendCart = await cartService.getCart();
          // Logic to merge or overwrite client cart with backend cart
          // For now, let's assume backend is source of truth if it has items
          if (backendCart.items.length > 0) {
            clearCart();
            backendCart.items.forEach(item => {
              // Note: need to fetch menu item details if backend only returns IDs
              // This is a simplified version
            });
          }
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      };
      syncCart();
    }
  }, [user]);

  const addToCart = async (menuItemId: string, variantId?: string, quantity: number = 1) => {
    if (user) {
      await cartService.addToCart({ menuItemId, variantId, quantity });
    }
    // Update local store as well for immediate feedback
    // addItem({ id: menuItemId, ... }); 
  };

  return {
    addToCart,
    // ... other cart actions
  };
};

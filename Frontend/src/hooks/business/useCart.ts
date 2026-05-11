import { useEffect, useCallback } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { cartService } from '@/services/api/cartService';
import { useAuth } from '@/hooks/auth/useAuth';

export const useCart = () => {
  const { user } = useAuth();
  const { clearCart } = useCartStore();

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
          }
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      };
      syncCart();
    }
  }, [user, clearCart]);

  const addToCart = useCallback(async (menuItemId: string, variantId?: string, quantity: number = 1) => {
    if (user) {
      await cartService.addToCart({ menuItemId, variantId, quantity });
    }
    // Update local store as well for immediate feedback
  }, [user]);

  return {
    addToCart,
    // ... other cart actions
  };
};

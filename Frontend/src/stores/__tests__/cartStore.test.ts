import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from '../../stores/cartStore';

// ────────────────────────────────────────────────────────────────────────────────
// Cart Store Unit Tests
// Zustand stores can be tested directly by calling their actions.
// We reset the store before each test via clearCart() to ensure isolation.
// ────────────────────────────────────────────────────────────────────────────────

const LATTE = { id: 'latte-1', name: 'Caramel Latte', price: 55, image: '/latte.jpg' };
const ESPRESSO = { id: 'espresso-1', name: 'Double Espresso', price: 35 };

describe('CartStore', () => {
  beforeEach(() => {
    act(() => useCartStore.getState().clearCart());
  });

  // ── addItem ────────────────────────────────────────────────────────────────

  describe('addItem', () => {
    it('adds a new item with quantity 1 by default', () => {
      act(() => useCartStore.getState().addItem(LATTE));

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(LATTE.id);
      expect(items[0].quantity).toBe(1);
    });

    it('adds a new item with explicit quantity', () => {
      act(() => useCartStore.getState().addItem(LATTE, 3));

      expect(useCartStore.getState().items[0].quantity).toBe(3);
    });

    it('increments quantity when same item is added again', () => {
      act(() => useCartStore.getState().addItem(LATTE, 2));
      act(() => useCartStore.getState().addItem(LATTE, 1));

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it('adds multiple distinct items separately', () => {
      act(() => useCartStore.getState().addItem(LATTE));
      act(() => useCartStore.getState().addItem(ESPRESSO));

      expect(useCartStore.getState().items).toHaveLength(2);
    });

    it('updates total after adding items', () => {
      act(() => useCartStore.getState().addItem(LATTE, 2));   // 55 * 2 = 110

      expect(useCartStore.getState().total).toBe(110);
    });
  });

  // ── removeItem ─────────────────────────────────────────────────────────────

  describe('removeItem', () => {
    it('removes the correct item', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE);
        useCartStore.getState().addItem(ESPRESSO);
        useCartStore.getState().removeItem(LATTE.id);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(ESPRESSO.id);
    });

    it('updates total after removal', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE, 1);   // 55
        useCartStore.getState().addItem(ESPRESSO, 1); // 35
        useCartStore.getState().removeItem(ESPRESSO.id);
      });

      expect(useCartStore.getState().total).toBe(55);
    });

    it('results in empty cart when last item is removed', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE);
        useCartStore.getState().removeItem(LATTE.id);
      });

      expect(useCartStore.getState().items).toHaveLength(0);
      expect(useCartStore.getState().total).toBe(0);
    });
  });

  // ── updateQuantity ─────────────────────────────────────────────────────────

  describe('updateQuantity', () => {
    it('updates item quantity correctly', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE, 1);
        useCartStore.getState().updateQuantity(LATTE.id, 4);
      });

      expect(useCartStore.getState().items[0].quantity).toBe(4);
      expect(useCartStore.getState().total).toBe(55 * 4);
    });

    it('removes item when quantity is set to 0', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE);
        useCartStore.getState().updateQuantity(LATTE.id, 0);
      });

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('removes item when quantity is negative', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE);
        useCartStore.getState().updateQuantity(LATTE.id, -1);
      });

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  // ── applyDiscount ──────────────────────────────────────────────────────────

  describe('applyDiscount', () => {
    it('applies percentage discount correctly', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE, 2);   // subtotal = 110
        useCartStore.getState().applyDiscount('SBUX10', 10); // 10% → saves 11
      });

      const state = useCartStore.getState();
      expect(state.discount?.code).toBe('SBUX10');
      expect(state.discount?.percentage).toBe(10);
      expect(state.total).toBe(99); // 110 - 11
    });

    it('replaces previous discount when a new one is applied', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE, 2); // 110
        useCartStore.getState().applyDiscount('OLD20', 20);
        useCartStore.getState().applyDiscount('NEW50', 50);
      });

      expect(useCartStore.getState().discount?.code).toBe('NEW50');
    });
  });

  // ── removeDiscount ─────────────────────────────────────────────────────────

  describe('removeDiscount', () => {
    it('restores full price after discount is removed', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE, 2); // 110
        useCartStore.getState().applyDiscount('HALF', 50);
        useCartStore.getState().removeDiscount();
      });

      const state = useCartStore.getState();
      expect(state.discount).toBeUndefined();
      expect(state.total).toBe(110);
    });
  });

  // ── getItemCount ───────────────────────────────────────────────────────────

  describe('getItemCount', () => {
    it('returns the sum of all item quantities', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE, 3);
        useCartStore.getState().addItem(ESPRESSO, 2);
      });

      expect(useCartStore.getState().getItemCount()).toBe(5);
    });

    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getItemCount()).toBe(0);
    });
  });

  // ── clearCart ─────────────────────────────────────────────────────────────

  describe('clearCart', () => {
    it('resets all cart state to initial values', () => {
      act(() => {
        useCartStore.getState().addItem(LATTE, 5);
        useCartStore.getState().applyDiscount('CODE', 20);
        useCartStore.getState().clearCart();
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.total).toBe(0);
      expect(state.discount).toBeUndefined();
    });
  });

  // ── toggleCart ─────────────────────────────────────────────────────────────

  describe('toggleCart', () => {
    it('toggles isOpen state', () => {
      expect(useCartStore.getState().isOpen).toBe(false);
      act(() => useCartStore.getState().toggleCart());
      expect(useCartStore.getState().isOpen).toBe(true);
      act(() => useCartStore.getState().toggleCart());
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });
});

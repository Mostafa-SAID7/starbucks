import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  discount?: {
    code: string;
    percentage: number;
    amount: number;
  };
  total: number;
  lastUpdated: number;
}

interface CartStore extends Cart {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleCart: () => void;
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyDiscount: (code: string, percentage: number) => void;
  removeDiscount: () => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const initialState: Cart = {
  items: [],
  total: 0,
  lastUpdated: Date.now(),
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            newItems = [...state.items, { ...item, quantity }];
          }

          return {
            items: newItems,
            total: calculateTotal(newItems, state.discount),
            lastUpdated: Date.now(),
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          return {
            items: newItems,
            total: calculateTotal(newItems, state.discount),
            lastUpdated: Date.now(),
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((i) => i.id !== id);
            return {
              items: newItems,
              total: calculateTotal(newItems, state.discount),
              lastUpdated: Date.now(),
            };
          }

          const newItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );

          return {
            items: newItems,
            total: calculateTotal(newItems, state.discount),
            lastUpdated: Date.now(),
          };
        });
      },

      applyDiscount: (code, percentage) => {
        set((state) => {
          const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const discountAmount = (subtotal * percentage) / 100;

          return {
            discount: {
              code,
              percentage,
              amount: discountAmount,
            },
            total: subtotal - discountAmount,
            lastUpdated: Date.now(),
          };
        });
      },

      removeDiscount: () => {
        set((state) => ({
          discount: undefined,
          total: calculateTotal(state.items, undefined),
          lastUpdated: Date.now(),
        }));
      },

      clearCart: () => {
        set({
          ...initialState,
          discount: undefined,
          lastUpdated: Date.now(),
        });
      },

      getTotal: () => get().total,

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'starbucks-cart',
      version: 1,
    }
  )
);

function calculateTotal(items: CartItem[], discount?: Cart['discount']): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (discount) {
    return subtotal - discount.amount;
  }
  return subtotal;
}

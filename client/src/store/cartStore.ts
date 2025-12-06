import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../../../shared/types.js';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.productId === newItem.productId);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.productId === newItem.productId
                ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.inventory) }
                : item
            ),
          };
        }
        
        return { items: [...state.items, newItem] };
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId),
      })),
      
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter(item => item.productId !== productId) };
        }
        
        return {
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, item.inventory) }
              : item
          ),
        };
      }),
      
      clearCart: () => set({ items: [] }),
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

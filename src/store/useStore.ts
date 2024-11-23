import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, User } from '../types';

interface StoreState {
  cart: CartItem[];
  user: User | null;
  isAdmin: boolean;
  loading: boolean;  // New loading state
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  setAdmin: (status: boolean) => void;
  setLoading: (status: boolean) => void; // New method to set loading state
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      user: null,
      isAdmin: false,
      loading: false, // Initial loading state
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity === 0
            ? state.cart.filter(item => item.id !== productId)
            : state.cart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
              ),
        })),
      clearCart: () => set({ cart: [] }),
      setUser: (user) => set({ user }),
      setAdmin: (status) => set({ isAdmin: status }),
      setLoading: (status) => set({ loading: status }), // Method to update loading state
    }),
    {
      name: 'taash-store', // Persist store to localStorage or sessionStorage
      getStorage: () => localStorage, // Optional: Default is localStorage, can be changed to sessionStorage
    }
  )
);

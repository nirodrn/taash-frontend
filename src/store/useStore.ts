import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, User } from '../types';

interface StoreState {
  cart: CartItem[];
  user: User | null;
  isAdmin: boolean;
  loading: boolean;  // Loading state to indicate whether data is being fetched or not
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  setAdmin: (status: boolean) => void;
  setLoading: (status: boolean) => void;  // Method to set the loading state
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [], 
      user: null,
      isAdmin: false,
      loading: false,  // Initial loading state
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 } // Increase quantity if product already in cart
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] }; // Add product if not in cart
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId), // Remove product from cart
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity === 0
            ? state.cart.filter(item => item.id !== productId)  // Remove item if quantity is 0
            : state.cart.map((item) =>
                item.id === productId ? { ...item, quantity } : item  // Update quantity
              ),
        })),
      clearCart: () => set({ cart: [] }),  // Clear cart completely
      setUser: (user) => set({ user }),  // Set logged-in user
      setAdmin: (status) => set({ isAdmin: status }),  // Set admin status
      setLoading: (status) => set({ loading: status }),  // Set loading state
    }),
    {
      name: 'taash-store', // Persist store to localStorage or sessionStorage
      getStorage: () => localStorage,  // Optional: can be sessionStorage as well
    }
  )
);

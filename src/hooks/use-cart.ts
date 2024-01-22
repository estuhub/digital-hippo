// 1. add items
// 2. remove items
// 3. clear the cart
// (keep track of cart items)

import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Definition of CartItem type representing an item in the cart
export type CartItem = {
  product: Product;
};

// Definition of CartState type representing the state of the cart
type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

// Creating the useCart store using Zustand with persistence
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // Function to add a product to the cart
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, { product }] };
        }),

      // Function to remove a product from the cart by productId
      removeItem: (productId) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== productId),
          };
        }),

      // Function to clear all items from the cart
      clearCart: () => set({ items: [] }),
    }),
    {
      // Configuration for Zustand's persistence middleware
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

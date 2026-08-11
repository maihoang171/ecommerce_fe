import type { IProductImage } from "@/features/product/services/product";
import { create } from "zustand";

export interface ILocalCartItem {
  productId: number;
  color: string;
  size: string;
  quantity: number;
  stockQuantity: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  images: IProductImage[];
}

interface ILocalCartState {
  cart: ILocalCartItem[];
  setCart: (cart: ILocalCartItem[]) => void;
  getLocalCart: () => ILocalCartItem[];
  getItemQuantity: (productId: number, color: string, size: string) => number;
  addToLocalCart: (item: ILocalCartItem) => void;
  updateQuantity: (
    productId: number,
    color: string,
    size: string,
    quantity: number,
  ) => void;
  removeFromLocalCart: (productId: number, color: string, size: string) => void;
  clearLocalCart: () => void;
  getTotalQuantity: () => number;
}

export const LOCAL_STORAGE_KEY = "guest_cart";

export const useCartStore = create<ILocalCartState>((set, get) => ({
  cart: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),

  setCart: (cart) => set({ cart }),

  getLocalCart: () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  },

  getItemQuantity: (productId, color, size) => {
    const item = get().cart.find(
      (i) => i.productId === productId && i.color === color && i.size === size,
    );
    return item ? item.quantity : 0;
  },

  addToLocalCart: (newItem) => {
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex(
      (item) =>
        item.productId === newItem.productId &&
        item.color === newItem.color &&
        item.size === newItem.size,
    );

    const updatedCart = [...currentCart];

    if (existingIndex > -1) {
      const currentQty = updatedCart[existingIndex].quantity;
      const updatedQty = Math.min(
        currentQty + newItem.quantity,
        newItem.stockQuantity,
      );

      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        ...newItem,
        quantity: updatedQty,
      };
    } else {
      updatedCart.push({
        ...newItem,
        quantity: Math.min(newItem.quantity, newItem.stockQuantity),
      });
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  updateQuantity: (productId, color, size, newQuantity) => {
    const updatedCart = get().cart.map((item) => {
      if (
        item.productId === productId &&
        item.color === color &&
        item.size === size
      ) {
        const validateQty = Math.min(newQuantity, item.stockQuantity);
        return { ...item, quantity: validateQty };
      }
      return item;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  removeFromLocalCart: (productId, color, size) => {
    const updatedCart = get().cart.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.color === color &&
          item.size === size
        ),
    );

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  clearLocalCart: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({ cart: [] });
  },

  getTotalQuantity: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

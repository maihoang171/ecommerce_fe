import { create } from "zustand";

export interface ICartItem {
  productId: number;
  color: string;
  size: string;
  quantity: number;
  stockQuantity?: number;
}

interface ICartState {
  cart: ICartItem[];
  setCart: (cart: ICartItem[]) => void;
  getLocalCart: () => ICartItem[];
  addToLocalCart: (item: ICartItem, stockLimit?: number) => void;
  updateQuantity: (
    productId: number,
    color: string,
    size: string,
    quantity: number,
  ) => void;
  clearLocalCart: () => void;
  getTotalQuantity: () => number;
}

export const LOCAL_STORAGE_KEY = "guest_cart";

export const useCartStore = create<ICartState>((set, get) => ({
  cart: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),

  setCart: (cart) => set({ cart }),

  getLocalCart: () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  },

  addToLocalCart: (newItem, stockLimit = Infinity) => {
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
      const updatedQty = Math.min(currentQty + newItem.quantity, stockLimit);
      updatedCart[existingIndex].quantity = updatedQty;
    } else {
      updatedCart.push({
        ...newItem,
        quantity: Math.min(newItem.quantity, stockLimit),
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
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

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

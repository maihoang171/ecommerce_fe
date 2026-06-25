import { create } from "zustand";
import type { IProduct } from "../services/product";

interface ProductListState {
  productList: IProduct[];
  setProductList: (productList: IProduct[]) => void;
}

export const useProductStore = create<ProductListState>((set) => ({
  productList: [],
  setProductList: (productList) => set({ productList }),
}));

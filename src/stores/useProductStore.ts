import { create } from "zustand";
import type { IProduct } from "../services/category";

interface ProductListState {
  productList: IProduct[];
  setProductList: (productList: IProduct[]) => void;
}

export const useProductListStore = create<ProductListState>((set) => ({
  productList: [],
  setProductList: (productList) => set({ productList }),
}));

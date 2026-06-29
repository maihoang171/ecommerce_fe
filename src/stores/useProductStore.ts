import { create } from "zustand";
import type { IProduct } from "../services/product";

interface ProductListState {
  product: IProduct;
  productList: IProduct[];
  setProduct: (product: IProduct) => void;
  setProductList: (productList: IProduct[]) => void;
}

export const useProductStore = create<ProductListState>((set) => ({
  product: {} as IProduct,
  productList: [],
  setProduct: (product) => set({ product }),
  setProductList: (productList) => set({ productList }),
}));

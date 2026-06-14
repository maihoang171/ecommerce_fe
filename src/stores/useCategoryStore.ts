import { create } from "zustand";
import type { IParentCategory } from "../services/auth";

interface CategoryListState {
  categoryList: IParentCategory[];
  setCategoryList: (categoryList: IParentCategory[]) => void;
  activeCategory: IParentCategory | null;
  setActiveCategory: (category: IParentCategory) => void;
  clickedCategoryId: string | null;
  setClickedCategoryId: (categoryId: string | null) => void;
}

export const useCategoryListStore = create<CategoryListState>((set) => ({
  categoryList: [],
  setCategoryList: (categoryList) => set({ categoryList }),
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
  clickedCategoryId: null,
  setClickedCategoryId: (categoryId) => set({ clickedCategoryId: categoryId }),
}));

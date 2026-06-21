import { create } from "zustand";
import type { IParentCategory } from "../services/category";

interface CategoryState {
  categoryList: IParentCategory[];
  setCategoryList: (categoryList: IParentCategory[]) => void;
  activeCategory: IParentCategory | undefined;
  setActiveCategory: (category: IParentCategory) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categoryList: [],
  activeCategory: undefined,

  setCategoryList: (categoryList) =>
    set((state) => ({
      categoryList,
      activeCategory: state.activeCategory || categoryList[0],
    })),

  setActiveCategory: (category) => set({ activeCategory: category }),
}));

import { create } from "zustand";
import type { IParentCategory, ICategory } from "../services/category";

interface CategoryState {
  categoryList: IParentCategory[];
  setCategoryList: (categoryList: IParentCategory[]) => void;
  activeParentCategory: IParentCategory | undefined;
  setActiveParentCategory: (category: IParentCategory) => void;
  activeChildCategory: ICategory | undefined;
  setActiveChildCategory: (category: ICategory | undefined) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categoryList: [],
  activeParentCategory: undefined,
  activeChildCategory: undefined,

  setCategoryList: (categoryList) =>
    set((state) => ({
      categoryList,
      activeParentCategory: state.activeParentCategory || categoryList[0],
    })),

  setActiveParentCategory: (category) =>
    set({ activeParentCategory: category }),

  setActiveChildCategory: (category) => set({ activeChildCategory: category }),
}));

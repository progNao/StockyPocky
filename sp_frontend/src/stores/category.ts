import { create } from "zustand";

type CategoryStore = {
  selectedCategoryId: number;
  setSelectedCategoryId: (id: number) => void;
  clearSelectedCategory: () => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategoryId: 0,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  clearSelectedCategory: () => set({ selectedCategoryId: 0 }),
}));
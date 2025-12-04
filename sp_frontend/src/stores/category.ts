import { create } from "zustand";

type CategoryStore = {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number) => void;
  clearSelectedCategory: () => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  clearSelectedCategory: () => set({ selectedCategoryId: null }),
}));
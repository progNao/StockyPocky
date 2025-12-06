import { ItemListDisplay } from "@/app/types";
import { create } from "zustand";

type ItemStore = {
  selectedItem: ItemListDisplay | null;
  setSelectedItem: (item: ItemListDisplay) => void;
  clearSelectedItem: () => void;
};

export const useItemStore = create<ItemStore>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
}));

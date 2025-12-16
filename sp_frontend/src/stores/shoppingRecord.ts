import { ShoppingRecordDisplay } from "@/app/types";
import { create } from "zustand";

type ShoppingRecordStore = {
  selectedItem: ShoppingRecordDisplay | null;
  setSelectedItem: (item: ShoppingRecordDisplay) => void;
  clearSelectedItem: () => void;
};

export const useShoppingRecordStoreStore = create<ShoppingRecordStore>(
  (set) => ({
    selectedItem: null,
    setSelectedItem: (item) => set({ selectedItem: item }),
    clearSelectedItem: () => set({ selectedItem: null }),
  })
);

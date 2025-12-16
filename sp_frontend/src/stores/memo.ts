import { Memo } from "@/app/types";
import { create } from "zustand";

type MemoStore = {
  selectedItem: Memo | null;
  setSelectedItem: (item: Memo) => void;
  clearSelectedItem: () => void;
};

export const useMemoStore = create<MemoStore>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  username: string | null;
  setUsername: (name: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (name) => set({ username: name }),
      clearUser: () => set({ username: null }),
    }),
    {
      name: "user-store", // ← localStorage のキー
    }
  )
);
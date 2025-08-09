import { UserDataStore } from "@/store/user/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserDataStore = create<UserDataStore>()(
  persist((set) => ({
    avatar: "",
    username: "",
    setUserName: (username: string) => {
      set(() => ({ username: username }));
    },
    setAvatar: (avatar: string | null) => {
      set(() => ({ avatar: avatar || "/avatars/goku-blue.jpg" }));
    },
  }),
  {
    name: "user-storage"
  }
)
);

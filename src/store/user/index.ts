import { useUserDataStore } from "@/store/user/store";


export const useUserAvatar = () => useUserDataStore(state => state.avatar);
export const useUsername = () => useUserDataStore(state => state.username);

export const useSetUsername = () => useUserDataStore(state => state.setUserName);
export const useSetAvatar = () => useUserDataStore(state => state.setAvatar);
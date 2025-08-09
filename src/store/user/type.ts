

export type UserDataStore = {
    avatar: string;
    username: string;
    setUserName: (username: string) => void;
    setAvatar: (avatar: string | null) => void;
}
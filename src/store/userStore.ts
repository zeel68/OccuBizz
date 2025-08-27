import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface iUser {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken: string;
    refreshToken: string;
}

interface UserState {
    user: iUser | null;
    authToken: string | null;
    isUserVerified: boolean;
    isEmailVerified: boolean;
    isUserLoggedIn: boolean;
    isLoginDilogOpen: boolean;
}

type UserActions = {
    setUser: (user: iUser, token: string) => void;
    clearUser: () => void;
    setIsUserVerified: (isUserVerified: boolean) => void;
    setIsEmailVerified: (isEmailVerified: boolean) => void;
    setIsLoginDilogOpen: (isLoginDilogOpen: boolean) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    authStatus: () => void;
};

const initialState: UserState = {
    user: null,
    authToken: null,
    isUserVerified: false,
    isEmailVerified: false,
    isUserLoggedIn: false,
    isLoginDilogOpen: false,
};

export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            setUser: (user, token) =>
                set(() => ({
                    user,
                    authToken: token,
                    isUserLoggedIn: true,
                })),

            clearUser: () => set(() => initialState),

            setIsUserVerified: (isUserVerified) => set(() => ({ isUserVerified })),

            setIsEmailVerified: (isEmailVerified) => set(() => ({ isEmailVerified })),

            setIsLoginDilogOpen: (isLoginDilogOpen) =>
                set(() => ({ isLoginDilogOpen })),

            setTokens: (accessToken, refreshToken) =>
                set((state) => ({
                    user: state.user
                        ? { ...state.user, accessToken, refreshToken }
                        : null,
                    authToken: accessToken,
                })),

            authStatus: () => {
                const state = get();
                set(() => ({ isUserLoggedIn: !!state.user && !!state.authToken }));
            },
        }),
        {
            name: 'user-store',
            // skipHydration: true,
        }
    )
);

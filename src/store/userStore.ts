
import apiClient from "@/lib/apiCalling"
import ApiClient from "@/lib/apiCalling"
import { create } from "zustand"
import { persist } from "zustand/middleware"



interface iUser {
    id: string
    store_id?: string
    name: string
    email: string
    phone_number?: string
    password?: string
    email_verified?: boolean
    phone_verified?: boolean
    last_login?: Date
    role_id?: string
    role: string
    profile_url?: string
    provider?: "local" | "google" | "facebook" | "apple"
    provider_id?: string
    address?: string
    is_active?: boolean
    cart?: any[]
    orders: any[]
    wishlist?: Array<{
        product_id: string
        store_id: string
        added_at: Date
    }>
    preferences?: {
        notifications: {
            email: boolean
            sms: boolean
            push: boolean
        }
        language: string
        currency: string
        timezone: string
    }
    login_attempts?: {
        count: number
        last_attempt?: Date
        locked_until?: Date
    }
    two_factor?: {
        enabled: boolean
        secret?: string
        backup_codes?: string[]
    }
    accessToken: string
    refreshToken: string
    created_at?: string
    updated_at?: string
}



interface UserState {
    user: iUser | null
    authToken: string | null
    refreshToken: string | null
    isUserVerified: boolean
    isEmailVerified: boolean
    isUserLoggedIn: boolean
    isLoginDilogOpen: boolean
    sessionId: string | null
    hasHydrated: boolean // ✅ Added
}

type UserActions = {
    setUser: (user: iUser, accessToken: string, refreshToken: string) => void

    clearUser: () => void
    setIsUserVerified: (isUserVerified: boolean) => void
    setIsEmailVerified: (isEmailVerified: boolean) => void
    setIsLoginDilogOpen: (isLoginDilogOpen: boolean) => void
    authStatus: () => void
    getAccessToken: () => string
    getRefreshToken: () => string
    updateTokens: (accessToken: string, refreshToken: string) => void
    fetchUserDetails: () => void
    setHasHydrated: (value: boolean) => void
}

const initialState: UserState = {
    user: null,
    authToken: null,
    refreshToken: null,
    isUserVerified: false,
    isEmailVerified: false,
    isUserLoggedIn: false,
    isLoginDilogOpen: false,
    sessionId: null,
    hasHydrated: false, // ✅ Added
}



export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            setUser: (user, accessToken, refreshToken) => {
                console.log("setting user", user.refreshToken);

                set(() => ({
                    user,
                    authToken: accessToken,
                    refreshToken: refreshToken,
                    isUserLoggedIn: true,
                }))
                console.log(get().user?.refreshToken);
            },

            clearUser: () => set((state) => ({
                ...initialState,
                hasHydrated: state.hasHydrated, // preserve hydration flag
            })),

            setIsUserVerified: (isUserVerified) => set(() => ({ isUserVerified })),

            setIsEmailVerified: (isEmailVerified) => set(() => ({ isEmailVerified })),

            setIsLoginDilogOpen: (isLoginDilogOpen) => set(() => ({ isLoginDilogOpen })),

            authStatus: () => set(() => ({ isUserLoggedIn: true })),
            fetchUserDetails: async () => {


                const response = await apiClient.get("/auth/me") as any;
                console.log(response.data.data);

                set({ user: response.data.data })

            },
            getAccessToken: () => get().user?.accessToken ?? "",
            getRefreshToken: () => {
                const oldRefreshToken = get().user?.refreshToken;

                if (oldRefreshToken)
                    return oldRefreshToken
                else {
                    set({ user: null });
                    return ""
                }
            },
            updateTokens: (accessToken: string, refreshToken: string) => {
                console.log("Updating tokens in store")
                const { user } = get()
                if (user) {
                    set({
                        authToken: accessToken,
                        refreshToken: refreshToken
                    })
                } else {
                    console.warn("Attempted to update tokens but no user exists in store")
                }
            },


            setHasHydrated: (value: boolean) => set(() => ({ hasHydrated: value })), // ✅ Added
        }),
        {
            name: "user-store",
            partialize: (state) => ({
                user: state.user,
                authToken: state.authToken,
                isUserLoggedIn: state.isUserLoggedIn,
            }),
            onRehydrateStorage: () => (state) => {
                // ✅ Set hydration flag
                state?.setHasHydrated?.(true)
            },
        },
    ),
)

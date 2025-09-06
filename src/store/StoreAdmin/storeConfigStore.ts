import ApiClient from '@/lib/apiCalling'
import { ApiResponse } from '@/models/api.model'
import { iStoreTheme, iStoreFeatures, iStoreConfig } from '@/models/StoreAdmin/storeconfig.model'
import { getSession } from 'next-auth/react'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'


interface StoreConfigState {
    // Store Configuration
    loading: boolean
    storeConfig: iStoreConfig | null

    error: string | null

    // Theme Settings
    themeSettings: iStoreTheme | null


    // Features
    features: iStoreFeatures | null


    // Actions
    fetchStoreConfig: () => Promise<void>
    updateStoreConfig: (config: Partial<iStoreConfig>) => Promise<void>
    updateThemeSettings: (theme: iStoreTheme) => Promise<void>
    updateFeatures: (features: iStoreFeatures) => Promise<void>
    clearError: () => void
}

const session = await getSession();
const apiClient = new ApiClient({
    headers: {
        Authorization: `Bearer ${session?.user?.accessToken || ''}`,
    },
});
export const useStoreConfigStore = create<StoreConfigState>()(
    devtools(
        (set, get) => ({
            // Initial state
            storeConfig: null,
            loading: false,
            error: null,
            themeSettings: null,
            features: null,


            // Fetch store configuration
            fetchStoreConfig: async () => {
                set({ loading: true, error: null })
                try {
                    const response = await apiClient.get('/store-admin/store/config') as ApiResponse<any>
                    const res = response;

                    console.log("res", res.data);

                    if (res.success) {
                        set({
                            storeConfig: res.data.data,
                            themeSettings: res.data.data.theme_settings,
                            features: res.data.data.features,
                            loading: false
                        })
                    } else {
                        set({ error: res.error, loading: false })
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch store config',
                        loading: false
                    })
                }
            },

            // Update store configuration
            updateStoreConfig: async (config: Partial<iStoreConfig>) => {
                set({ loading: true, error: null })
                try {

                    console.log(config);
                    
                    const response = await apiClient.put('/store-admin/store/config', {
                        config
                    }) as ApiResponse<any>

                    const data = response;
                    console.log(data.data);

                    if (data.success) {
                        set(state => ({
                            storeConfig: { ...state.storeConfig, ...data.data },
                            loading: false
                        }))
                    } else {
                        set({ error: data.error, loading: false })
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update store config',
                        loading: false
                    })
                }
            },

            // Update theme settings
            updateThemeSettings: async (theme: iStoreTheme) => {
                set({ loading: true, error: null })
                try {
                    const response = await fetch('/api/store/theme', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme_settings: theme })
                    })

                    const data = await response.json()

                    // if (data.success) {
                    //     set(state => ({
                    //         themeSettings: theme,
                    //         storeConfig: state.storeConfig ? {
                    //             ...state.storeConfig,
                    //             theme_settings: theme
                    //         } : null,
                    //         loading: false
                    //     }))
                    // } else {
                    //     set({ error: data.message, loading: false })
                    // }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update theme',
                        loading: false
                    })
                }
            },

            // Update features
            updateFeatures: async (features: iStoreFeatures) => {
                set({ loading: true, error: null })
                try {
                    const response = await fetch('/api/store/features', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ features })
                    })

                    const data = await response.json()

                    if (data.success) {
                        set(state => ({
                            features,
                            storeConfig: state.storeConfig ? {
                                ...state.storeConfig,
                                features
                            } : null,
                            loading: false
                        }))
                    } else {
                        set({ error: data.message, loading: false })
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update features',
                        loading: false
                    })
                }
            },

            // Clear error
            clearError: () => set({ error: null })
        }),
        { name: 'store-config-store' }
    )
)

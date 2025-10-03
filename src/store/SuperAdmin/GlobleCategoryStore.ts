// stores/categoryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/apiCalling";
import { iGlobalCategory } from "@/models/SuperAdmin/GlobalCategory";

interface GlobalCategoryState {
  categories: iGlobalCategory[];
  loading: boolean;
  error: string | null;
  lastFetch: number;

  fetchCategories: (force?: boolean) => Promise<void>;
  createCategory: (categoryData: any) => Promise<any>;
  updateCategory: (id: string, categoryData: any) => Promise<any>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategoryStatus: (id: string, status: boolean) => Promise<void>
  clearError: () => void;
}

export const useGlobalCategoryStore = create<GlobalCategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,
      lastFetch: 0,

      fetchCategories: async (force: boolean = false) => {
        const state = get();
        const now = Date.now();
        set({ loading: true, error: null });
        try {
          // Create API client without session dependency
          const response = await apiClient.get(
            "/super-admin/category",
          ) as any;


          if (response.success) {
            const data = response.data.data || response.data;
            set({
              categories: data.categories,
              loading: false,
              lastFetch: now,
            });

          } else {
            set({
              categories: [],
              error: response.error || "Failed to fetch categories",
              loading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch categories",
            loading: false,
          });
        }
      },

      // Create Category
      createCategory: async (categoryData: any) => {
        set({ loading: true, error: null });
        try {


          const response = await apiClient.post(
            "/store-admin/category",
            categoryData,
          ) as any;

          if (response.success) {
            const state = get();
            const newCategory = response.data.data;
            get().fetchCategories()
            return newCategory;
          } else {
            const errorMsg = response.error || "Failed to create category";
            set({ error: errorMsg, loading: false });
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMessage = error.message || "Failed to create category";
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Update Category
      updateCategory: async (
        id: string,
        categoryData: any,
      ) => {
        set({ loading: true, error: null });
        try {


          const response = await apiClient.put(
            `/store-admin/category/${id}`,
            categoryData,
          ) as any;

          if (response.success) {
            const state = get();

            get().fetchCategories();
          } else {
            const errorMsg = response.error || "Failed to update category";
            set({ error: errorMsg, loading: false });
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMessage = error.message || "Failed to update category";
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Delete Category
      deleteCategory: async (id: string) => {
        set({ loading: true, error: null });
        try {


          const response = await apiClient.delete(
            `/store-admin/category/${id}`,
          ) as any;

          if (response.success) {

            get().fetchCategories()
          } else {
            const errorMsg = response.error || "Failed to delete category";
            set({ error: errorMsg, loading: false });
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMessage = error.message || "Failed to delete category";
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },
      toggleCategoryStatus: async (id: string, status: boolean) => {
        set({ loading: true, error: null });
        try {


          const response = await apiClient.post(
            `/store-admin/category/${id}/status`, { status }
          ) as any;

          if (response.success) {

            get().fetchCategories()
          } else {
            const errorMsg = response.error || "Failed to delete category";
            set({ error: errorMsg, loading: false });
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMessage = error.message || "Failed to delete category";
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "global-category-store",
      partialize: (state) => ({
        categories: state.categories,
        lastFetch: state.lastFetch,
      }),
    },
  ),
);

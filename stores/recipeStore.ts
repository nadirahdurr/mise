import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { Recipe } from "@/lib/supabase";

interface RecipeState {
  // Data
  recipes: Recipe[];
  searchTerm: string;

  // Pagination
  hasMore: boolean;
  currentPage: number;
  total: number;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  lastFetch: number | null;

  // Cache settings
  cacheExpiry: number; // 5 minutes

  // Actions
  setRecipes: (recipes: Recipe[], reset?: boolean) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  removeRecipe: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setPagination: (pagination: {
    hasMore: boolean;
    total: number;
    currentPage: number;
  }) => void;

  // Async actions
  fetchRecipes: (force?: boolean) => Promise<void>;
  loadMoreRecipes: () => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;

  // Getters
  shouldRefetch: () => boolean;
  getCachedRecipes: () => Recipe[] | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useRecipeStore = create<RecipeState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      recipes: [],
      searchTerm: "",
      hasMore: true,
      currentPage: 0,
      total: 0,
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      lastFetch: null,
      cacheExpiry: CACHE_DURATION,

      // Sync actions
      setRecipes: (recipes, reset = true) => {
        set(
          (state) => {
            let updatedRecipes;
            if (reset) {
              updatedRecipes = recipes;
            } else {
              // Append new recipes, but filter out duplicates based on ID
              const existingIds = new Set(state.recipes.map((r) => r.id));
              const newRecipes = recipes.filter(
                (recipe) => !existingIds.has(recipe.id)
              );
              updatedRecipes = [...state.recipes, ...newRecipes];
            }

            return {
              recipes: updatedRecipes,
              lastFetch: Date.now(),
              isLoading: false,
              isLoadingMore: false,
              isRefreshing: false,
            };
          },
          false,
          "setRecipes"
        );
      },

      addRecipe: (recipe) => {
        set(
          (state) => ({
            recipes: [recipe, ...state.recipes],
          }),
          false,
          "addRecipe"
        );
      },

      updateRecipe: (id, updates) => {
        set(
          (state) => ({
            recipes: state.recipes.map((recipe) =>
              recipe.id === id ? { ...recipe, ...updates } : recipe
            ),
          }),
          false,
          "updateRecipe"
        );
      },

      removeRecipe: (id) => {
        set(
          (state) => ({
            recipes: state.recipes.filter((recipe) => recipe.id !== id),
          }),
          false,
          "removeRecipe"
        );
      },

      setSearchTerm: (searchTerm) => {
        set({ searchTerm }, false, "setSearchTerm");
        // Automatically fetch recipes with new search term
        get().fetchRecipes(true);
      },

      setLoading: (isLoading) => {
        set({ isLoading }, false, "setLoading");
      },

      setRefreshing: (isRefreshing) => {
        set({ isRefreshing }, false, "setRefreshing");
      },

      setLoadingMore: (isLoadingMore) => {
        set({ isLoadingMore }, false, "setLoadingMore");
      },

      setPagination: ({ hasMore, total, currentPage }) => {
        set({ hasMore, total, currentPage }, false, "setPagination");
      },

      // Async actions
      fetchRecipes: async (force = false) => {
        const state = get();

        // Check if we should skip fetch (but always fetch if there's a search term)
        if (
          !force &&
          !state.searchTerm &&
          !state.shouldRefetch() &&
          state.recipes.length > 0
        ) {
          return;
        }

        try {
          set({
            isLoading: state.recipes.length === 0,
            isRefreshing: state.recipes.length > 0,
            currentPage: 0,
          });

          const url = new URL("/api/recipes", window.location.origin);
          url.searchParams.set("limit", "12");
          url.searchParams.set("offset", "0");
          if (state.searchTerm) {
            url.searchParams.set("search", state.searchTerm);
          }

          const response = await fetch(url.toString());
          if (!response.ok) {
            throw new Error(`Failed to fetch recipes: ${response.status}`);
          }

          const data = await response.json();
          state.setRecipes(data.recipes || [], true); // Reset recipes
          state.setPagination({
            hasMore: data.pagination?.hasMore || false,
            total: data.pagination?.total || 0,
            currentPage: 1,
          });
        } catch (error) {
          console.error("Error fetching recipes:", error);
          set({ isLoading: false, isRefreshing: false });
          throw error;
        }
      },

      loadMoreRecipes: async () => {
        const state = get();

        // Don't load if already loading or no more data
        if (state.isLoadingMore || !state.hasMore) {
          return;
        }

        try {
          state.setLoadingMore(true);

          const url = new URL("/api/recipes", window.location.origin);
          url.searchParams.set("limit", "12");
          url.searchParams.set("offset", (state.currentPage * 12).toString());
          if (state.searchTerm) {
            url.searchParams.set("search", state.searchTerm);
          }

          const response = await fetch(url.toString());
          if (!response.ok) {
            throw new Error(`Failed to load more recipes: ${response.status}`);
          }

          const data = await response.json();
          state.setRecipes(data.recipes || [], false); // Append recipes
          state.setPagination({
            hasMore: data.pagination?.hasMore || false,
            total: data.pagination?.total || 0,
            currentPage: state.currentPage + 1,
          });
        } catch (error) {
          console.error("Error loading more recipes:", error);
          throw error;
        } finally {
          state.setLoadingMore(false);
        }
      },

      deleteRecipe: async (id) => {
        const state = get();
        const originalRecipes = state.recipes;
        const originalTotal = state.total;

        // Optimistic update - remove from UI immediately
        state.removeRecipe(id);
        // Update total count
        set({ total: Math.max(0, state.total - 1) });

        try {
          const response = await fetch(`/api/recipes/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            console.error(
              "Delete API error:",
              response.status,
              response.statusText
            );
            // Rollback on error
            set({ recipes: originalRecipes, total: originalTotal });

            const errorText = await response.text();
            throw new Error(
              `Failed to delete recipe: ${response.status} ${errorText}`
            );
          }

          // Success - deletion is permanent, no rollback needed
        } catch (error) {
          console.error("Delete recipe error:", error);
          // Rollback on error
          set({ recipes: originalRecipes, total: originalTotal });
          throw error;
        }
      },

      shouldRefetch: () => {
        const { lastFetch, cacheExpiry } = get();
        if (!lastFetch) return true;
        return Date.now() - lastFetch > cacheExpiry;
      },

      getCachedRecipes: () => {
        const state = get();
        return state.shouldRefetch() ? null : state.recipes;
      },
    })),
    { name: "recipe-store" }
  )
);

// Selectors for optimized subscriptions
export const useRecipes = () => useRecipeStore((state) => state.recipes);
export const useRecipesLoading = () =>
  useRecipeStore((state) => state.isLoading);
export const useRecipesRefreshing = () =>
  useRecipeStore((state) => state.isRefreshing);
export const useRecipeSearch = () =>
  useRecipeStore((state) => state.searchTerm);

// Note: Client-side filtering removed - now using server-side search

// Individual stable action selectors to prevent re-renders
export const useFetchRecipes = () =>
  useRecipeStore((state) => state.fetchRecipes);
export const useLoadMoreRecipes = () =>
  useRecipeStore((state) => state.loadMoreRecipes);
export const useDeleteRecipe = () =>
  useRecipeStore((state) => state.deleteRecipe);
export const useSetSearchTerm = () =>
  useRecipeStore((state) => state.setSearchTerm);
export const useAddRecipe = () => useRecipeStore((state) => state.addRecipe);
export const useUpdateRecipe = () =>
  useRecipeStore((state) => state.updateRecipe);

// Pagination selectors
export const useRecipesHasMore = () => useRecipeStore((state) => state.hasMore);
export const useRecipesLoadingMore = () =>
  useRecipeStore((state) => state.isLoadingMore);
export const useRecipesTotal = () => useRecipeStore((state) => state.total);

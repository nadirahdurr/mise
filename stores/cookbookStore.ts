import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface Cookbook {
  id: string;
  title: string;
  description?: string;
  author: string;
  cover_color: string;
  cover_photo_url?: string;
  cover_style: string;
  created_at: string;
  recipe_count?: number;
}

interface CookbookState {
  // Data
  cookbooks: Cookbook[];

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
  setCookbooks: (cookbooks: Cookbook[], reset?: boolean) => void;
  addCookbook: (cookbook: Cookbook) => void;
  updateCookbook: (id: string, updates: Partial<Cookbook>) => void;
  removeCookbook: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setPagination: (pagination: {
    hasMore: boolean;
    total: number;
    currentPage: number;
  }) => void;

  // Async actions
  fetchCookbooks: (force?: boolean) => Promise<void>;
  loadMoreCookbooks: () => Promise<void>;
  createCookbook: (cookbookData: Partial<Cookbook>) => Promise<Cookbook>;
  deleteCookbook: (id: string) => Promise<void>;

  // Getters
  shouldRefetch: () => boolean;
  getCachedCookbooks: () => Cookbook[] | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCookbookStore = create<CookbookState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      cookbooks: [],
      hasMore: true,
      currentPage: 0,
      total: 0,
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      lastFetch: null,
      cacheExpiry: CACHE_DURATION,

      // Sync actions
      setCookbooks: (cookbooks, reset = true) => {
        set(
          (state) => {
            let updatedCookbooks;
            if (reset) {
              updatedCookbooks = cookbooks;
            } else {
              // Append new cookbooks, but filter out duplicates based on ID
              const existingIds = new Set(state.cookbooks.map((c) => c.id));
              const newCookbooks = cookbooks.filter(
                (cookbook) => !existingIds.has(cookbook.id)
              );
              updatedCookbooks = [...state.cookbooks, ...newCookbooks];
            }

            return {
              cookbooks: updatedCookbooks,
              lastFetch: Date.now(),
              isLoading: false,
              isLoadingMore: false,
              isRefreshing: false,
            };
          },
          false,
          "setCookbooks"
        );
      },

      addCookbook: (cookbook) => {
        set(
          (state) => ({
            cookbooks: [cookbook, ...state.cookbooks],
          }),
          false,
          "addCookbook"
        );
      },

      updateCookbook: (id, updates) => {
        set(
          (state) => ({
            cookbooks: state.cookbooks.map((cookbook) =>
              cookbook.id === id ? { ...cookbook, ...updates } : cookbook
            ),
          }),
          false,
          "updateCookbook"
        );
      },

      removeCookbook: (id) => {
        set(
          (state) => ({
            cookbooks: state.cookbooks.filter((cookbook) => cookbook.id !== id),
          }),
          false,
          "removeCookbook"
        );
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
      fetchCookbooks: async (force = false) => {
        const state = get();

        // Check if we should skip fetch
        if (!force && !state.shouldRefetch() && state.cookbooks.length > 0) {
          return;
        }

        try {
          set({
            isLoading: state.cookbooks.length === 0,
            isRefreshing: state.cookbooks.length > 0,
            currentPage: 0,
          });

          const url = new URL("/api/cookbooks", window.location.origin);
          url.searchParams.set("limit", "12");
          url.searchParams.set("offset", "0");

          const response = await fetch(url.toString());
          if (!response.ok) {
            throw new Error(`Failed to fetch cookbooks: ${response.status}`);
          }

          const data = await response.json();
          state.setCookbooks(data.cookbooks || [], true); // Reset cookbooks
          state.setPagination({
            hasMore: data.pagination?.hasMore || false,
            total: data.pagination?.total || 0,
            currentPage: 1,
          });
        } catch (error) {
          console.error("Error fetching cookbooks:", error);
          set({ isLoading: false, isRefreshing: false });
          throw error;
        }
      },

      loadMoreCookbooks: async () => {
        const state = get();

        // Don't load if already loading or no more data
        if (state.isLoadingMore || !state.hasMore) {
          return;
        }

        try {
          state.setLoadingMore(true);

          const url = new URL("/api/cookbooks", window.location.origin);
          url.searchParams.set("limit", "12");
          url.searchParams.set("offset", (state.currentPage * 12).toString());

          const response = await fetch(url.toString());
          if (!response.ok) {
            throw new Error(
              `Failed to load more cookbooks: ${response.status}`
            );
          }

          const data = await response.json();
          state.setCookbooks(data.cookbooks || [], false); // Append cookbooks
          state.setPagination({
            hasMore: data.pagination?.hasMore || false,
            total: data.pagination?.total || 0,
            currentPage: state.currentPage + 1,
          });
        } catch (error) {
          console.error("Error loading more cookbooks:", error);
          throw error;
        } finally {
          state.setLoadingMore(false);
        }
      },

      createCookbook: async (cookbookData) => {
        try {
          const response = await fetch("/api/cookbooks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cookbookData),
          });

          if (!response.ok) {
            throw new Error("Failed to create cookbook");
          }

          const data = await response.json();
          const newCookbook = data.cookbook;

          // Add to store
          get().addCookbook(newCookbook);

          return newCookbook;
        } catch (error) {
          console.error("Error creating cookbook:", error);
          throw error;
        }
      },

      deleteCookbook: async (id) => {
        // Optimistic update
        const state = get();
        const originalCookbooks = state.cookbooks;
        state.removeCookbook(id);

        try {
          const response = await fetch(`/api/cookbooks/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            // Rollback on error
            set({ cookbooks: originalCookbooks });
            throw new Error("Failed to delete cookbook");
          }
        } catch (error) {
          // Rollback on error
          set({ cookbooks: originalCookbooks });
          throw error;
        }
      },

      // Computed getters
      shouldRefetch: () => {
        const { lastFetch, cacheExpiry } = get();
        if (!lastFetch) return true;
        return Date.now() - lastFetch > cacheExpiry;
      },

      getCachedCookbooks: () => {
        const state = get();
        return state.shouldRefetch() ? null : state.cookbooks;
      },
    })),
    { name: "cookbook-store" }
  )
);

// Selectors for optimized subscriptions
export const useCookbooks = () => useCookbookStore((state) => state.cookbooks);
export const useCookbooksLoading = () =>
  useCookbookStore((state) => state.isLoading);
export const useCookbooksRefreshing = () =>
  useCookbookStore((state) => state.isRefreshing);

// Individual stable action selectors to prevent re-renders
export const useFetchCookbooks = () =>
  useCookbookStore((state) => state.fetchCookbooks);
export const useLoadMoreCookbooks = () =>
  useCookbookStore((state) => state.loadMoreCookbooks);
export const useCreateCookbook = () =>
  useCookbookStore((state) => state.createCookbook);
export const useDeleteCookbook = () =>
  useCookbookStore((state) => state.deleteCookbook);
export const useUpdateCookbook = () =>
  useCookbookStore((state) => state.updateCookbook);

// Pagination selectors
export const useCookbooksHasMore = () =>
  useCookbookStore((state) => state.hasMore);
export const useCookbooksLoadingMore = () =>
  useCookbookStore((state) => state.isLoadingMore);
export const useCookbooksTotal = () => useCookbookStore((state) => state.total);

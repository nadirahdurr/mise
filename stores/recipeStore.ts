import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Recipe } from '@/lib/supabase';

interface RecipeState {
  // Data
  recipes: Recipe[];
  searchTerm: string;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  lastFetch: number | null;
  
  // Cache settings
  cacheExpiry: number; // 5 minutes
  
  // Actions
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  removeRecipe: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  
  // Async actions
  fetchRecipes: (force?: boolean) => Promise<void>;
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
      searchTerm: '',
      isLoading: false,
      isRefreshing: false,
      lastFetch: null,
      cacheExpiry: CACHE_DURATION,

      // Sync actions
      setRecipes: (recipes) => {
        set({ 
          recipes, 
          lastFetch: Date.now(),
          isLoading: false,
          isRefreshing: false
        }, false, 'setRecipes');
      },

      addRecipe: (recipe) => {
        set((state) => ({
          recipes: [recipe, ...state.recipes]
        }), false, 'addRecipe');
      },

      updateRecipe: (id, updates) => {
        set((state) => ({
          recipes: state.recipes.map(recipe =>
            recipe.id === id ? { ...recipe, ...updates } : recipe
          )
        }), false, 'updateRecipe');
      },

      removeRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter(recipe => recipe.id !== id)
        }), false, 'removeRecipe');
      },

      setSearchTerm: (searchTerm) => {
        set({ searchTerm }, false, 'setSearchTerm');
      },

      setLoading: (isLoading) => {
        set({ isLoading }, false, 'setLoading');
      },

      setRefreshing: (isRefreshing) => {
        set({ isRefreshing }, false, 'setRefreshing');
      },

      // Async actions
      fetchRecipes: async (force = false) => {
        const state = get();
        
        // Check if we should skip fetch
        if (!force && !state.shouldRefetch() && state.recipes.length > 0) {
          return;
        }

        try {
          set({ isLoading: state.recipes.length === 0, isRefreshing: state.recipes.length > 0 });
          
          const response = await fetch('/api/recipes');
          if (!response.ok) {
            throw new Error(`Failed to fetch recipes: ${response.status}`);
          }
          
          const data = await response.json();
          state.setRecipes(data.recipes || []);
        } catch (error) {
          console.error('Error fetching recipes:', error);
          set({ isLoading: false, isRefreshing: false });
          throw error;
        }
      },

      deleteRecipe: async (id) => {
        // Optimistic update
        const state = get();
        const originalRecipes = state.recipes;
        state.removeRecipe(id);

        try {
          const response = await fetch(`/api/recipes/${id}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            // Rollback on error
            set({ recipes: originalRecipes });
            throw new Error('Failed to delete recipe');
          }
        } catch (error) {
          // Rollback on error
          set({ recipes: originalRecipes });
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
      }
    })),
    { name: 'recipe-store' }
  )
);

// Selectors for optimized subscriptions
export const useRecipes = () => useRecipeStore(state => state.recipes);
export const useRecipesLoading = () => useRecipeStore(state => state.isLoading);
export const useRecipesRefreshing = () => useRecipeStore(state => state.isRefreshing);
export const useRecipeSearch = () => useRecipeStore(state => state.searchTerm);

// Stable filtered recipes selector
const filteredRecipesSelector = (state: RecipeState) => {
  if (!state.searchTerm.trim()) return state.recipes;
  
  const term = state.searchTerm.toLowerCase();
  return state.recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(term) ||
    recipe.description?.toLowerCase().includes(term) ||
    recipe.cuisine_tags?.some(tag => 
      tag.toLowerCase().includes(term)
    )
  );
};

export const useFilteredRecipes = () => useRecipeStore(filteredRecipesSelector);

// Individual stable action selectors to prevent re-renders
export const useFetchRecipes = () => useRecipeStore(state => state.fetchRecipes);
export const useDeleteRecipe = () => useRecipeStore(state => state.deleteRecipe);
export const useSetSearchTerm = () => useRecipeStore(state => state.setSearchTerm);
export const useAddRecipe = () => useRecipeStore(state => state.addRecipe);
export const useUpdateRecipe = () => useRecipeStore(state => state.updateRecipe);
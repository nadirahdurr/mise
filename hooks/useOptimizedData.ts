import { useEffect, useCallback, useMemo } from 'react';
import { 
  useFetchRecipes, 
  useDeleteRecipe, 
  useSetSearchTerm, 
  useAddRecipe, 
  useUpdateRecipe,
  useRecipes, 
  useRecipesLoading, 
  useFilteredRecipes, 
  useRecipeSearch as useRecipeSearchState 
} from '@/stores/recipeStore';
import { 
  useFetchCookbooks, 
  useCreateCookbook, 
  useDeleteCookbook, 
  useUpdateCookbook,
  useCookbooks, 
  useCookbooksLoading 
} from '@/stores/cookbookStore';

// Optimized recipe hooks
export function useRecipeData() {
  const recipes = useRecipes();
  const isLoading = useRecipesLoading();
  const fetchRecipes = useFetchRecipes();

  // Auto-fetch on mount with dependency tracking
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(() => ({
    recipes,
    isLoading,
    refetch: fetchRecipes
  }), [recipes, isLoading, fetchRecipes]);
}

export function useRecipeSearch() {
  const searchTerm = useRecipeSearchState();
  const filteredRecipes = useFilteredRecipes();
  const setSearchTerm = useSetSearchTerm();

  // Memoized search handler
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, [setSearchTerm]);

  return useMemo(() => ({
    searchTerm,
    filteredRecipes,
    setSearchTerm: handleSearch
  }), [searchTerm, filteredRecipes, handleSearch]);
}

export function useRecipeOperations() {
  const deleteRecipe = useDeleteRecipe();
  const addRecipe = useAddRecipe();
  const updateRecipe = useUpdateRecipe();

  // Memoized operation handlers
  const handleDelete = useCallback(async (id: string) => {
    await deleteRecipe(id);
  }, [deleteRecipe]);

  const handleAdd = useCallback((recipe: any) => {
    addRecipe(recipe);
  }, [addRecipe]);

  const handleUpdate = useCallback((id: string, updates: any) => {
    updateRecipe(id, updates);
  }, [updateRecipe]);

  return useMemo(() => ({
    deleteRecipe: handleDelete,
    addRecipe: handleAdd,
    updateRecipe: handleUpdate
  }), [handleDelete, handleAdd, handleUpdate]);
}

// Optimized cookbook hooks
export function useCookbookData() {
  const cookbooks = useCookbooks();
  const isLoading = useCookbooksLoading();
  const fetchCookbooks = useFetchCookbooks();

  // Auto-fetch on mount
  useEffect(() => {
    fetchCookbooks();
  }, [fetchCookbooks]);

  return useMemo(() => ({
    cookbooks,
    isLoading,
    refetch: fetchCookbooks
  }), [cookbooks, isLoading, fetchCookbooks]);
}

export function useCookbookOperations() {
  const createCookbook = useCreateCookbook();
  const deleteCookbook = useDeleteCookbook();
  const updateCookbook = useUpdateCookbook();

  // Memoized operation handlers
  const handleCreate = useCallback(async (data: any) => {
    return await createCookbook(data);
  }, [createCookbook]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteCookbook(id);
  }, [deleteCookbook]);

  const handleUpdate = useCallback((id: string, updates: any) => {
    updateCookbook(id, updates);
  }, [updateCookbook]);

  return useMemo(() => ({
    createCookbook: handleCreate,
    deleteCookbook: handleDelete,
    updateCookbook: handleUpdate
  }), [handleCreate, handleDelete, handleUpdate]);
}

// Performance monitoring hook
export function usePerformanceMetrics() {
  return useMemo(() => {
    const metrics = {
      renderTime: performance.now(),
      timestamp: Date.now()
    };
    
    return {
      startTime: metrics.renderTime,
      logRender: (componentName: string) => {
        const renderTime = performance.now() - metrics.renderTime;
        if (renderTime > 16) { // Log slow renders (> 16ms = < 60fps)
          console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  }, []);
}

// Data prefetching hook for performance
export function useDataPrefetch() {
  const fetchRecipes = useFetchRecipes();
  const fetchCookbooks = useFetchCookbooks();

  const prefetchAll = useCallback(async () => {
    try {
      await Promise.allSettled([
        fetchRecipes(),
        fetchCookbooks()
      ]);
    } catch (error) {
      console.error('Prefetch error:', error);
    }
  }, [fetchRecipes, fetchCookbooks]);

  return { prefetchAll };
}

// Smart refresh hook with background updates
export function useSmartRefresh() {
  const fetchRecipes = useFetchRecipes();
  const fetchCookbooks = useFetchCookbooks();

  const refreshAll = useCallback(async (force = false) => {
    try {
      await Promise.allSettled([
        fetchRecipes(force),
        fetchCookbooks(force)
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    }
  }, [fetchRecipes, fetchCookbooks]);

  // Auto-refresh on visibility change (when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshAll(); // Background refresh when tab becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshAll]);

  return { refreshAll };
}
import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new SimpleCache();

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    enabled?: boolean;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (useCache = true) => {
    if (options?.enabled === false) return;

    try {
      setError(null);
      
      // Check cache first
      if (useCache) {
        const cachedData = cache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      const result = await fetcher();
      
      // Cache the result
      cache.set(key, result, options?.ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, options?.ttl, options?.enabled]);

  const invalidateCache = useCallback(() => {
    cache.invalidate(key);
  }, [key]);

  const refetch = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache
  };
}

export { cache };
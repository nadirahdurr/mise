"use client";

import { useEffect } from 'react';
import { useDataPrefetch, useSmartRefresh } from '@/hooks/useOptimizedData';

export function DataPrefetchProvider({ children }: { children: React.ReactNode }) {
  const { prefetchAll } = useDataPrefetch();
  const { refreshAll } = useSmartRefresh();

  useEffect(() => {
    // Initial prefetch on app load
    prefetchAll();

    // Set up periodic background refresh (every 5 minutes when tab is active)
    const interval = setInterval(() => {
      if (!document.hidden) {
        refreshAll();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [prefetchAll, refreshAll]);

  // Prefetch on network reconnection
  useEffect(() => {
    const handleOnline = () => {
      console.log('🔄 Network reconnected, refreshing data...');
      refreshAll(true); // Force refresh
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [refreshAll]);

  // Prefetch on route changes (if using Next.js router)
  useEffect(() => {
    const handleRouteChange = () => {
      // Small delay to ensure new page is ready
      setTimeout(() => {
        refreshAll();
      }, 100);
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [refreshAll]);

  return <>{children}</>;
}

// Performance monitoring component
export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('🚀 Page Load Performance:', {
              dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              tcp: navEntry.connectEnd - navEntry.connectStart,
              request: navEntry.responseStart - navEntry.requestStart,
              response: navEntry.responseEnd - navEntry.responseStart,
              domParse: navEntry.domContentLoadedEventStart - navEntry.responseEnd,
              domReady: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              total: navEntry.loadEventEnd - navEntry.startTime
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
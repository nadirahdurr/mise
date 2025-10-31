"use client";

import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  loadingComponent?: React.ReactNode;
}

export default function InfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  children,
  threshold = 0.1,
  rootMargin = "100px",
  loadingComponent,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // Only trigger if we're intersecting, have more data, and aren't already loading
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  return (
    <div>
      {children}

      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className="w-full h-4" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          {loadingComponent || (
            <div className="flex items-center gap-3 text-helper-text">
              <div className="w-5 h-5 border-2 border-olive-oil-gold border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* End indicator */}
      {!hasMore && !isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-helper-text text-sm bg-butcher-paper px-4 py-2 rounded-full border border-outline-gray">
            You've reached the end 🎉
          </div>
        </div>
      )}
    </div>
  );
}

// Custom loading components for different contexts
export function RecipeLoadingIndicator() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex items-center gap-3 text-helper-text">
        <div className="w-5 h-5 border-2 border-olive-oil-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading more delicious recipes...</span>
      </div>
    </div>
  );
}

export function CookbookLoadingIndicator() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex items-center gap-3 text-helper-text">
        <div className="w-5 h-5 border-2 border-olive-oil-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading more cookbooks...</span>
      </div>
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="mise-card animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-video bg-butcher-paper/50 rounded-mise mb-4" />
      
      <div className="space-y-3">
        {/* Title placeholder */}
        <div className="h-6 bg-butcher-paper/50 rounded w-3/4" />
        
        {/* Description placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-butcher-paper/30 rounded w-full" />
          <div className="h-4 bg-butcher-paper/30 rounded w-2/3" />
        </div>
        
        {/* Time and servings placeholder */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-butcher-paper/30 rounded" />
            <div className="h-3 bg-butcher-paper/30 rounded w-16" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-butcher-paper/30 rounded" />
            <div className="h-3 bg-butcher-paper/30 rounded w-12" />
          </div>
        </div>
        
        {/* Tags placeholder */}
        <div className="flex gap-1">
          <div className="h-6 bg-olive-oil-gold/10 rounded w-16" />
          <div className="h-6 bg-olive-oil-gold/10 rounded w-20" />
          <div className="h-6 bg-olive-oil-gold/10 rounded w-14" />
        </div>
      </div>
    </div>
  );
}

export function CookbookCardSkeleton() {
  return (
    <div className="mise-card animate-pulse">
      <div className="flex items-start gap-4">
        {/* Icon placeholder */}
        <div className="w-12 h-12 bg-olive-oil-gold/10 rounded-mise flex-shrink-0" />
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title placeholder */}
          <div className="h-6 bg-butcher-paper/50 rounded w-3/4" />
          
          {/* Description placeholder */}
          <div className="space-y-1">
            <div className="h-4 bg-butcher-paper/30 rounded w-full" />
            <div className="h-4 bg-butcher-paper/30 rounded w-2/3" />
          </div>
          
          {/* Metadata placeholder */}
          <div className="flex items-center gap-4">
            <div className="h-3 bg-butcher-paper/30 rounded w-16" />
            <div className="h-3 bg-butcher-paper/30 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecipeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CookbookListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CookbookCardSkeleton key={i} />
      ))}
    </div>
  );
}
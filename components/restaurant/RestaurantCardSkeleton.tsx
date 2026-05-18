/**
 * RestaurantCardSkeleton — placeholder card shown while restaurants load.
 */

import { Skeleton } from '@/components/ui/skeleton';

export function RestaurantCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

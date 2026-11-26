import { Skeleton } from "@/shared/ui/skeleton";

export function AuditLogDetailsSkeleton() {
  return (
  <div className="space-y-6 max-w-7xl font-mono">
  {/* Breadcrumb Skeleton */}
  <Skeleton className="h-4 w-64" />

  {/* Top Header Row Skeleton */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="space-y-2">
  <Skeleton className="h-6 w-72" />
  <Skeleton className="h-4 w-48" />
  </div>
  <Skeleton className="h-9 w-24" />
  </div>

  {/* Details Card Skeleton */}
  <div className="border border-border/80 bg-white shadow-xs p-6 sm:p-8 space-y-6">
  <div className="space-y-1">
  <Skeleton className="h-3 w-16" />
  <Skeleton className="h-4 w-20" />
  </div>

  <div className="space-y-1">
  <Skeleton className="h-3 w-16" />
  <Skeleton className="h-4 w-16" />
  </div>

  <div className="space-y-1">
  <Skeleton className="h-3 w-16" />
  <Skeleton className="h-4 w-40" />
  <Skeleton className="h-3 w-48" />
  <Skeleton className="h-3 w-28" />
  </div>

  <div className="space-y-1">
  <Skeleton className="h-3 w-16" />
  <Skeleton className="h-4 w-52" />
  </div>

  <div className="space-y-1">
  <Skeleton className="h-3 w-20" />
  <Skeleton className="h-4 w-44" />
  </div>

  <div className="space-y-2">
  <Skeleton className="h-3 w-20" />
  <Skeleton className="h-28 w-full" />
  </div>
  </div>
  </div>
  );
}

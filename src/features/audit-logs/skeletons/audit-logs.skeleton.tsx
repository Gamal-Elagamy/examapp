import { Skeleton } from "@/shared/ui/skeleton";

export function AuditLogsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-8 w-48 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Filter Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-xs">
        <div className="bg-blue-600 px-6 py-3.5 flex items-center justify-between">
          <Skeleton className="h-4 w-36 bg-white/30 rounded" />
          <Skeleton className="h-4 w-12 bg-white/30 rounded" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-xs">
        <div className="bg-blue-600 px-6 py-3.5 flex items-center justify-between">
          <Skeleton className="h-4 w-full max-w-md bg-white/30 rounded" />
          <Skeleton className="h-4 w-12 bg-white/30 rounded" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                <div className="col-span-2 space-y-1">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <div className="col-span-4 space-y-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
                <div className="col-span-3 space-y-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
                <div className="col-span-3 space-y-1">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>
              <Skeleton className="size-8 rounded-lg ms-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

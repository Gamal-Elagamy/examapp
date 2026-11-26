import { Skeleton } from "@/shared/ui/skeleton";

export function AdminDiplomasTableSkeleton() {
  return (
  <div className="space-y-6 animate-pulse">
  {/* Top Action & Pagination Bar Skeleton */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="flex items-center gap-3">
  <Skeleton className="h-5 w-28" />
  <Skeleton className="h-8 w-36" />
  </div>
  <Skeleton className="h-9 w-40" />
  </div>

  {/* Filter Box Skeleton */}
  <div className="border border-border/80 overflow-hidden">
  <div className="bg-primary/20 h-11 w-full" />
  <div className="p-5 space-y-4 bg-white">
  <Skeleton className="h-10 w-full" />
  <Skeleton className="h-10 w-full" />
  </div>
  </div>

  {/* Table Skeleton */}
  <div className="border border-border/80 bg-white overflow-hidden">
  <div className="bg-primary/20 h-11 w-full" />
  <div className="divide-y divide-border/60">
  {Array.from({ length: 5 }).map((_, i) => (
  <div key={i} className="px-4 py-3.5 flex items-center justify-between gap-6">
  <div className="flex items-center gap-6 sm:gap-10 flex-1">
  <Skeleton className="size-14 sm:size-16" />
  <Skeleton className="h-5 w-40 sm:w-52" />
  <Skeleton className="hidden md:block h-12 flex-1" />
  </div>
  <Skeleton className="size-8" />
  </div>
  ))}
  </div>
  </div>
  </div>
  );
}

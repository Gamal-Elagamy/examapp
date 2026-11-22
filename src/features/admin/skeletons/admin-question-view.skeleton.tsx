import { Skeleton } from "@/shared/ui/skeleton";

export function AdminQuestionViewSkeleton() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-10 rounded" />
        <Skeleton className="h-3.5 w-2 rounded" />
        <Skeleton className="h-3.5 w-32 rounded" />
        <Skeleton className="h-3.5 w-2 rounded" />
        <Skeleton className="h-3.5 w-16 rounded" />
        <Skeleton className="h-3.5 w-2 rounded" />
        <Skeleton className="h-3.5 w-48 rounded" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-72 rounded-lg" />
          <Skeleton className="h-4 w-56 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg" />
          <Skeleton className="h-9 w-18 rounded-lg" />
        </div>
      </div>

      {/* Details Card */}
      <div className="rounded-2xl border border-border/70 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-border/60">
          <Skeleton className="h-3 w-16 rounded mb-2" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="px-6 py-5 border-b border-border/60">
          <Skeleton className="h-3 w-10 rounded mb-2" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <div className="px-6 py-5">
          <Skeleton className="h-3 w-14 rounded mb-2" />
          <Skeleton className="h-4 w-6 rounded" />
        </div>
      </div>
    </div>
  );
}


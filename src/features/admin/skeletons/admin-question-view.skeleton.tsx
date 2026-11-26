import { Skeleton } from "@/shared/ui/skeleton";

export function AdminQuestionViewSkeleton() {
  return (
  <div className="space-y-6 max-w-5xl">
  {/* Breadcrumb */}
  <div className="flex items-center gap-2">
  <Skeleton className="h-3.5 w-10" />
  <Skeleton className="h-3.5 w-2" />
  <Skeleton className="h-3.5 w-32" />
  <Skeleton className="h-3.5 w-2" />
  <Skeleton className="h-3.5 w-16" />
  <Skeleton className="h-3.5 w-2" />
  <Skeleton className="h-3.5 w-48" />
  </div>

  {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="space-y-2">
  <Skeleton className="h-7 w-72" />
  <Skeleton className="h-4 w-56" />
  </div>
  <div className="flex items-center gap-3">
  <Skeleton className="h-9 w-24" />
  <Skeleton className="h-9 w-16" />
  <Skeleton className="h-9 w-18" />
  </div>
  </div>

  {/* Details Card */}
  <div className="border border-border/70 bg-white shadow-xs overflow-hidden">
  <div className="px-6 py-5 border-b border-border/60">
  <Skeleton className="h-3 w-16 mb-2" />
  <Skeleton className="h-4 w-80" />
  </div>
  <div className="px-6 py-5 border-b border-border/60">
  <Skeleton className="h-3 w-10 mb-2" />
  <Skeleton className="h-4 w-64" />
  </div>
  <div className="px-6 py-5">
  <Skeleton className="h-3 w-14 mb-2" />
  <Skeleton className="h-4 w-6" />
  </div>
  </div>
  </div>
  );
}


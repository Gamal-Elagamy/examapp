import { Skeleton } from "@/shared/ui/skeleton";

export function ExamCardSkeleton() {
  return (
  <div
  style={{ backgroundColor: "rgba(239, 246, 255, 1)" }}
  className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 border border-brand-blue-200/60 bg-brand-blue-50 p-5 shadow-2xs"
  >
  {/* Icon Box Skeleton */}
  <Skeleton
  style={{
  backgroundColor: "rgba(219, 234, 254, 1)",
  borderColor: "rgba(142, 197, 255, 1)",
  }}
  className="size-16 sm:size-20 bg-brand-blue-100 border border-brand-blue-300 shrink-0"
  />

  {/* Main Content Skeleton */}
  <div className="flex-1 w-full space-y-3">
  {/* Top Header Row */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
  <Skeleton className="h-6 w-40" />
  <div className="flex items-center gap-4">
  <Skeleton className="h-4 w-24" />
  <Skeleton className="h-4 w-20" />
  </div>
  </div>

  {/* Description Skeleton */}
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-4/5" />
  </div>
  </div>
  </div>
  );
}

export function DiplomaExamsSkeleton() {
  return (
  <div className="space-y-6">
  {/* Breadcrumbs Skeleton */}
  <div className="flex items-center gap-2">
  <Skeleton className="h-4 w-16" />
  <span className="text-muted-foreground text-xs">/</span>
  <Skeleton className="h-4 w-32" />
  <span className="text-muted-foreground text-xs">/</span>
  <Skeleton className="h-4 w-14" />
  </div>

  {/* Header Row: Back Button + Blue Banner Skeleton */}
  <div className="flex items-center gap-3">
  <Skeleton className="size-12 shrink-0" />
  <Skeleton className="h-12 sm:h-14 flex-1" />
  </div>

  {/* Exams List Stack */}
  <div className="space-y-4 pt-2">
  {Array.from({ length: 4 }).map((_, index) => (
  <ExamCardSkeleton key={index} />
  ))}
  </div>
  </div>
  );
}

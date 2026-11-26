import { Skeleton } from "@/shared/ui/skeleton";

export function ExamQuestionsSkeleton() {
  return (
  <div className="space-y-6 max-w-5xl">
  {/* Breadcrumbs Skeleton */}
  <div className="flex items-center gap-2">
  <Skeleton className="h-4 w-16" />
  <span className="text-muted-foreground text-xs">/</span>
  <Skeleton className="h-4 w-32" />
  <span className="text-muted-foreground text-xs">/</span>
  <Skeleton className="h-4 w-24" />
  </div>

  {/* Header Row: Back Button & Banner Skeleton */}
  <div className="flex items-center gap-3">
  <Skeleton className="size-12 sm:size-14 shrink-0" />
  <Skeleton className="h-12 sm:h-14 flex-1" />
  </div>

  {/* Main Card Skeleton */}
  <div className="border border-border/80 bg-white p-6 sm:p-8 shadow-2xs space-y-8">
  {/* Top Bar Skeleton */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
  <div className="space-y-2 flex-1 max-w-md">
  <Skeleton className="h-4 w-48" />
  <Skeleton className="h-2 w-full" />
  </div>
  <div className="flex items-center gap-5">
  <Skeleton className="h-4 w-28" />
  <Skeleton className="size-12 shrink-0" />
  </div>
  </div>

  {/* Question Title Skeleton */}
  <div className="space-y-2">
  <Skeleton className="h-7 w-3/4" />
  </div>

  {/* Answer Options Stack Skeleton */}
  <div className="space-y-3">
  {Array.from({ length: 4 }).map((_, index) => (
  <div
  key={index}
  style={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
  className="w-full p-4 sm:p-4.5 flex items-center gap-3.5 border border-transparent"
  >
  <Skeleton className="size-5 shrink-0" />
  <Skeleton className="h-4 w-2/5" />
  </div>
  ))}
  </div>

  {/* Action Buttons Skeleton */}
  <div className="flex items-center gap-4 pt-4 border-t border-border/60">
  <Skeleton className="h-11 sm:w-48 flex-1 sm:flex-initial" />
  <Skeleton className="h-11 flex-1" />
  </div>
  </div>
  </div>
  );
}

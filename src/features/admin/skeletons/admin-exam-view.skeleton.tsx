import { Skeleton } from "@/shared/ui/skeleton";

export function AdminExamViewSkeleton() {
  return (
  <div className="space-y-6 max-w-5xl animate-pulse">
  {/* Breadcrumb Skeleton */}
  <div className="flex items-center gap-2">
  <Skeleton className="h-4 w-16" />
  <span className="text-muted-foreground">/</span>
  <Skeleton className="h-4 w-48" />
  </div>

  {/* Header Skeleton */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="space-y-2">
  <Skeleton className="h-8 w-80" />
  <Skeleton className="h-4 w-44" />
  </div>
  <div className="flex items-center gap-3">
  <Skeleton className="h-9 w-28" />
  <Skeleton className="h-9 w-20" />
  <Skeleton className="h-9 w-24" />
  </div>
  </div>

  {/* Details Card Skeleton */}
  <div className="border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
  {/* Image */}
  <div className="space-y-2">
  <Skeleton className="h-3 w-14" />
  <Skeleton className="w-72 sm:w-80 aspect-square" />
  </div>

  {/* Title */}
  <div className="space-y-2 pt-2">
  <Skeleton className="h-3 w-12" />
  <Skeleton className="h-5 w-64" />
  </div>

  {/* Description */}
  <div className="space-y-2 pt-2">
  <Skeleton className="h-3 w-20" />
  <Skeleton className="h-4 w-full max-w-2xl" />
  <Skeleton className="h-4 w-3/4 max-w-xl" />
  </div>

  {/* Diploma */}
  <div className="space-y-2 pt-2">
  <Skeleton className="h-3 w-16" />
  <Skeleton className="h-4 w-40" />
  </div>

  {/* Duration */}
  <div className="space-y-2 pt-2">
  <Skeleton className="h-3 w-16" />
  <Skeleton className="h-4 w-28" />
  </div>

  {/* No. of Questions */}
  <div className="space-y-2 pt-2">
  <Skeleton className="h-3 w-28" />
  <Skeleton className="h-4 w-12" />
  </div>
  </div>

  {/* Exam Questions Skeleton */}
  <div className="border border-border/80 bg-white overflow-hidden shadow-2xs">
  <div className="bg-primary/90 px-6 py-4 flex items-center justify-between">
  <Skeleton className="h-5 w-32 bg-white/30" />
  <Skeleton className="h-7 w-32 bg-white/30" />
  </div>
  <div className="bg-slate-100 border-b border-border/80 px-6 py-3 flex items-center justify-between">
  <Skeleton className="h-4 w-12" />
  <Skeleton className="h-4 w-12" />
  </div>
  <div className="divide-y divide-border/60">
  {[1, 2, 3, 4, 5].map((item) => (
  <div key={item} className="px-6 py-4 flex items-center justify-between gap-4">
  <Skeleton className="h-4 w-3/4 max-w-md" />
  <Skeleton className="size-8" />
  </div>
  ))}
  </div>
  </div>
  </div>
  );
}

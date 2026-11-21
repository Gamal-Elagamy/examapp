import { Skeleton } from "@/shared/ui/skeleton";

export function AdminExamViewSkeleton() {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-48 rounded" />
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-4 w-44 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Details Card Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
        {/* Image */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-14 rounded" />
          <Skeleton className="w-72 sm:w-80 aspect-square rounded-xl" />
        </div>

        {/* Title */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-5 w-64 rounded" />
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-4 w-full max-w-2xl rounded" />
          <Skeleton className="h-4 w-3/4 max-w-xl rounded" />
        </div>

        {/* Diploma */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>

        {/* Duration */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        {/* No. of Questions */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </div>

      {/* Exam Questions Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-2xs">
        <div className="bg-primary/90 px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-5 w-32 bg-white/30 rounded" />
          <Skeleton className="h-7 w-32 bg-white/30 rounded-xl" />
        </div>
        <div className="bg-slate-100 border-b border-border/80 px-6 py-3 flex items-center justify-between">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="px-6 py-4 flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-3/4 max-w-md rounded" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

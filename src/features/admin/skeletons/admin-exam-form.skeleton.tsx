import { Skeleton } from "@/shared/ui/skeleton";

interface AdminExamFormSkeletonProps {
  isEditing?: boolean;
}

export function AdminExamFormSkeleton({
  isEditing = false,
}: AdminExamFormSkeletonProps) {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      {/* Top Header Row Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded" />
            <span className="text-muted-foreground">/</span>
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          {isEditing && (
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-7 w-64 rounded-lg" />
              <Skeleton className="h-4 w-40 rounded" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>

      {/* Card 1: Exam Information Skeleton */}
      <div className="rounded-2xl overflow-hidden border border-border/80 shadow-2xs bg-white">
        <div className="bg-primary/90 px-6 py-4">
          <Skeleton className="h-5 w-36 bg-white/30 rounded" />
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-14 rounded" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Questions Skeleton (if editing) */}
      {isEditing && (
        <div className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-2xs">
          <div className="bg-primary/90 px-6 py-4 flex items-center justify-between">
            <Skeleton className="h-5 w-32 bg-white/30 rounded" />
            <Skeleton className="h-7 w-32 bg-white/30 rounded-xl" />
          </div>
          <div className="bg-slate-100 border-b border-border/80 px-6 py-3">
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <div className="divide-y divide-border/60">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <Skeleton className="h-4 w-3/4 max-w-md rounded" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

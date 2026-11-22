import { Skeleton } from "@/shared/ui/skeleton";

export function AdminQuestionFormSkeleton() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-12 rounded" />
        <Skeleton className="h-3.5 w-2 rounded" />
        <Skeleton className="h-3.5 w-36 rounded" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* Card 1: Question Information */}
      <div className="rounded-2xl border border-border/80 bg-white shadow-xs overflow-hidden">
        <div className="bg-blue-600 px-6 py-3.5">
          <Skeleton className="h-4 w-40 bg-white/30 rounded" />
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-12 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Card 2: Question Answers */}
      <div className="rounded-2xl border border-border/80 bg-white shadow-xs overflow-hidden">
        <div className="bg-blue-600 px-6 py-3.5">
          <Skeleton className="h-4 w-36 bg-white/30 rounded" />
        </div>
        <div className="bg-slate-100/90 px-6 py-2.5 flex items-center justify-between">
          <Skeleton className="h-3.5 w-10 rounded" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-7 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

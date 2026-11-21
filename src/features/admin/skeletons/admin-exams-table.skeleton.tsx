import { Skeleton } from "@/shared/ui/skeleton";

export function AdminExamsTableSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-white shadow-2xs overflow-hidden">
      {/* Table Header */}
      <div className="bg-primary text-white px-4 py-3 sm:px-6 flex items-center justify-between">
        <Skeleton className="h-4 w-64 bg-white/20" />
        <Skeleton className="h-4 w-16 bg-white/20" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3.5 flex items-center justify-between gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-6 sm:gap-10 flex-1 min-w-0">
              <Skeleton className="size-14 sm:size-16 rounded-xl shrink-0" />
              <div className="w-48 sm:w-72 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
              <Skeleton className="hidden md:block h-4 flex-1 max-w-48 rounded-md" />
              <Skeleton className="hidden sm:block h-4 w-12 mx-auto rounded-md" />
            </div>
            <Skeleton className="size-8 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from "@/shared/ui/skeleton";

export function DiplomaCardSkeleton() {
  return (
    <div className="relative flex flex-col items-center justify-end overflow-hidden rounded-2xl bg-muted aspect-[3/4] min-h-[360px] p-4 shadow-xs">
      <Skeleton className="absolute inset-0 size-full" />
      <div className="relative z-10 w-[284px] max-w-[calc(100%-24px)] h-14 rounded-xl bg-background/80 px-4 py-3.5 flex items-center shadow-md">
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}

export function DiplomaListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <DiplomaCardSkeleton key={index} />
      ))}
    </div>
  );
}

import { Skeleton } from "@/shared/ui/skeleton";

export function RegisterFormSkeleton() {
  return (
  <div className="w-full space-y-6">
  <Skeleton className="h-8 w-44 mb-4" />

  {/* Step progress bar skeleton */}
  <div className="flex items-center justify-between mb-8">
  <Skeleton className="size-3 rotate-45" />
  <Skeleton className="flex-1 h-0.5 mx-2" />
  <Skeleton className="size-3 rotate-45" />
  <Skeleton className="flex-1 h-0.5 mx-2" />
  <Skeleton className="size-3 rotate-45" />
  <Skeleton className="flex-1 h-0.5 mx-2" />
  <Skeleton className="size-3 rotate-45" />
  </div>

  {/* Field skeleton */}
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-16" />
  <Skeleton className="h-10 w-full" />
  </div>

  {/* Button skeleton */}
  <Skeleton className="h-10 w-full mt-4" />

  {/* Footer skeleton */}
  <div className="flex justify-center pt-3">
  <Skeleton className="h-4 w-48" />
  </div>
  </div>
  );
}

import { Skeleton } from "@/shared/ui/skeleton";

export function ResetPasswordSkeleton() {
  return (
  <div className="w-full space-y-6">
  <div className="space-y-1">
  <Skeleton className="h-8 w-56" />
  <Skeleton className="h-4 w-72" />
  </div>

  <div className="space-y-4">
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-28" />
  <Skeleton className="h-10 w-full" />
  </div>

  <div className="space-y-1.5">
  <Skeleton className="h-4 w-36" />
  <Skeleton className="h-10 w-full" />
  </div>

  <Skeleton className="h-10 w-full mt-2" />

  <div className="flex justify-center pt-3">
  <Skeleton className="h-4 w-48" />
  </div>
  </div>
  </div>
  );
}

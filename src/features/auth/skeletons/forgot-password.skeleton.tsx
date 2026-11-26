import { Skeleton } from "@/shared/ui/skeleton";

export function ForgotPasswordSkeleton() {
  return (
  <div className="w-full space-y-6">
  <div className="space-y-1">
  <Skeleton className="h-8 w-48" />
  <Skeleton className="h-4 w-72" />
  </div>

  <div className="space-y-4">
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-16" />
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

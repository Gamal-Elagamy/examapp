import { Skeleton } from "@/shared/ui/skeleton";

export function LoginFormSkeleton() {
  return (
  <div className="w-full space-y-4">
  <Skeleton className="h-8 w-24 mb-6" />

  {/* Username field */}
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-16" />
  <Skeleton className="h-10 w-full" />
  </div>

  {/* Password field */}
  <div className="space-y-1.5">
  <Skeleton className="h-4 w-16" />
  <Skeleton className="h-10 w-full" />
  </div>

  {/* Forgot password */}
  <div className="flex justify-end">
  <Skeleton className="h-3 w-28" />
  </div>

  {/* Login button */}
  <Skeleton className="h-10 w-full mt-2" />

  {/* Footer link */}
  <div className="flex justify-center pt-3">
  <Skeleton className="h-4 w-48" />
  </div>
  </div>
  );
}

import { Suspense } from "react";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";
import { Skeleton } from "@/shared/ui/skeleton";

function ChangePasswordSkeleton() {
  return (
  <div className="space-y-6 max-w-lg">
  <Skeleton className="h-14" />
  <Skeleton className="h-14" />
  <Skeleton className="h-14" />
  <Skeleton className="h-10 w-36 pt-2" />
  </div>
  );
}

export function ChangePasswordRoute() {
  return (
  <Suspense fallback={<ChangePasswordSkeleton />}>
  <ChangePasswordForm />
  </Suspense>
  );
}

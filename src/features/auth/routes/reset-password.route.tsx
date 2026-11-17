import { Suspense } from "react";
import { ResetPasswordForm } from "../components/reset-password-form";
import { ResetPasswordSkeleton } from "../skeletons/reset-password.skeleton";

export function ResetPasswordRoute() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

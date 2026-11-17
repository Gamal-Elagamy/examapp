import { Suspense } from "react";
import { ForgotPasswordForm } from "../components/forgot-password-form";
import { ForgotPasswordSkeleton } from "../skeletons/forgot-password.skeleton";

export function ForgotPasswordRoute() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

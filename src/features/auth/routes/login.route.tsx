import { Suspense } from "react";
import { LoginForm } from "../components/login-form";
import { LoginFormSkeleton } from "../skeletons/login-form.skeleton";

export function LoginRoute() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

import { Suspense } from "react";
import { RegisterForm } from "../components/register-form";
import { RegisterFormSkeleton } from "../skeletons/register-form.skeleton";

export function RegisterRoute() {
  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";
import { Skeleton } from "@/shared/ui/skeleton";

export const metadata: Metadata = {
  title: "Admin Change Password | Elevate Exam App",
  description: "Update your admin account password.",
};

function ChangePasswordSkeleton() {
  return (
    <div className="space-y-6 max-w-lg">
      <Skeleton className="h-14 rounded-lg" />
      <Skeleton className="h-14 rounded-lg" />
      <Skeleton className="h-14 rounded-lg" />
      <Skeleton className="h-10 w-36 rounded-lg pt-2" />
    </div>
  );
}

export default function AdminChangePasswordPage() {
  return (
    <Suspense fallback={<ChangePasswordSkeleton />}>
      <ChangePasswordForm />
    </Suspense>
  );
}

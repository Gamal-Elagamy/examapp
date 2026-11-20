import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getUserProfile } from "@/features/account/lib/apis/account.api";
import { ProfileForm } from "@/features/account/components/profile-form";
import { Skeleton } from "@/shared/ui/skeleton";

export const metadata: Metadata = {
  title: "Admin Profile | Elevate Exam App",
  description: "Manage your admin personal account profile details.",
};

function ProfileLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>
      <Skeleton className="h-14 rounded-lg" />
      <Skeleton className="h-14 rounded-lg" />
      <Skeleton className="h-14 rounded-lg" />
      <div className="flex justify-between pt-4 border-t border-border/60">
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
    </div>
  );
}

export default async function AdminProfilePage() {
  const session = await auth();
  let initialUser = session?.user;

  if (session?.token) {
    try {
      const res = await getUserProfile(session.token);
      if (res.status && res.payload?.user) {
        initialUser = res.payload.user;
      }
    } catch {
      // Fallback to session user
    }
  }

  return (
    <Suspense fallback={<ProfileLoadingSkeleton />}>
      <ProfileForm initialUser={initialUser} />
    </Suspense>
  );
}

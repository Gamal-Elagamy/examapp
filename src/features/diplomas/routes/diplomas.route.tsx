import { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import { auth } from "@/auth";
import { getDiplomas } from "../lib/apis/diplomas.api";
import { DiplomaList } from "../components/diploma-list";
import { DiplomaListSkeleton } from "../skeletons/diploma-card.skeleton";
import type { IDiplomasPayload } from "@/shared/lib/types/diploma";

interface DiplomasRouteProps {
  search?: string;
}

export async function DiplomasRoute({ search }: DiplomasRouteProps) {
  const session = await auth();
  let initialData: IDiplomasPayload | undefined = undefined;

  try {
    if (session?.token) {
      const res = await getDiplomas({ page: 1, limit: 12, search }, session.token);
      if (res.status && res.payload) {
        initialData = res.payload;
      }
    }
  } catch {
    // If SSR fetch fails, client hook handles query/retry
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="text-xs text-muted-foreground font-mono">
        Diplomas
      </div>

      {/* Blue Header Banner */}
      <div className="flex items-center gap-3 rounded-lg bg-primary px-6 py-4 text-primary-foreground shadow-xs">
        <GraduationCap className="size-6 text-white shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Diplomas
        </h1>
      </div>

      {/* Diplomas Infinite List with Suspense */}
      <Suspense fallback={<DiplomaListSkeleton />}>
        <DiplomaList search={search} initialData={initialData} />
      </Suspense>
    </div>
  );
}

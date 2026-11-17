import { Suspense } from "react";
import { auth } from "@/auth";
import { getDiplomaById } from "../lib/apis/diplomas.api";
import { DiplomaExamsView } from "../components/diploma-exams-view";
import { DiplomaExamsSkeleton } from "../skeletons/exam-card.skeleton";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface DiplomaExamsRouteProps {
  diplomaId: string;
}

export async function DiplomaExamsRoute({ diplomaId }: DiplomaExamsRouteProps) {
  const session = await auth();
  let initialDiploma: IDiploma | undefined;

  if (session?.token && diplomaId) {
    try {
      const response = await getDiplomaById(diplomaId, session.token);
      if (response.status && response.payload?.diploma) {
        initialDiploma = response.payload.diploma;
      }
    } catch {
      // Graceful fallback to client fetching in DiplomaExamsView
    }
  }

  return (
    <Suspense fallback={<DiplomaExamsSkeleton />}>
      <DiplomaExamsView diplomaId={diplomaId} initialDiploma={initialDiploma} />
    </Suspense>
  );
}

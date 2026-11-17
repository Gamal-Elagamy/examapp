import { Suspense } from "react";
import { auth } from "@/auth";
import { getExamQuestions } from "../lib/apis/questions.api";
import { ExamQuestionsView } from "../components/exam-questions-view";
import { ExamQuestionsSkeleton } from "../skeletons/exam-questions.skeleton";
import type { IQuestion } from "@/shared/lib/types/question";

interface ExamQuestionsRouteProps {
  examId: string;
}

export async function ExamQuestionsRoute({ examId }: ExamQuestionsRouteProps) {
  const session = await auth();
  let initialQuestions: IQuestion[] = [];
  let examTitle: string | undefined;

  if (session?.token && examId) {
    try {
      const response = await getExamQuestions(examId, undefined, session.token);
      if (response.status && response.payload?.questions) {
        initialQuestions = response.payload.questions;
        if (initialQuestions.length > 0) {
          examTitle = initialQuestions[0]?.exam?.title;
        }
      }
    } catch {
      // Graceful fallback to client fetching in ExamQuestionsView
    }
  }

  return (
    <Suspense fallback={<ExamQuestionsSkeleton />}>
      <ExamQuestionsView
        examId={examId}
        initialQuestions={initialQuestions}
        examTitle={examTitle}
      />
    </Suspense>
  );
}

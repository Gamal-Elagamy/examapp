import { Suspense } from "react";
import { auth } from "@/auth";
import { getExamQuestions, getExamById } from "../lib/apis/questions.api";
import { ExamQuestionsView } from "../components/exam-questions-view";
import { ExamQuestionsSkeleton } from "../skeletons/exam-questions.skeleton";
import type { IQuestion } from "@/shared/lib/types/question";
import type { IExamDetails } from "@/shared/lib/types/exam";

interface ExamQuestionsRouteProps {
  examId: string;
}

export async function ExamQuestionsRoute({ examId }: ExamQuestionsRouteProps) {
  const session = await auth();
  let initialQuestions: IQuestion[] = [];
  let initialExam: IExamDetails | undefined;

  if (session?.token && examId) {
    try {
      const [questionsRes, examRes] = await Promise.all([
        getExamQuestions(examId, undefined, session.token).catch(() => null),
        getExamById(examId, session.token).catch(() => null),
      ]);

      if (questionsRes?.status && questionsRes.payload?.questions) {
        initialQuestions = questionsRes.payload.questions;
      }

      if (examRes?.status && examRes.payload?.exam) {
        initialExam = examRes.payload.exam;
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
        initialExam={initialExam}
      />
    </Suspense>
  );
}

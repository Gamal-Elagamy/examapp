import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import {
  getExamById,
  getExamQuestions,
  getQuestionById,
} from "@/features/questions/lib/apis/questions.api";
import { getExams } from "@/features/exams/lib/apis/exams.api";
import { AdminQuestionFormRoute } from "@/features/admin/routes/admin-question-form.route";
import type { IQuestion } from "@/shared/lib/types/question";

interface PageProps {
  params: Promise<{ id: string; questionId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { questionId } = await params;
  const session = await auth();

  try {
    const qRes = await getQuestionById(questionId, session?.token).catch(() => null);
    const question = qRes?.status && qRes.payload ? qRes.payload.question : null;
    return {
      title: question
        ? `Edit: ${question.text} | Admin`
        : "Edit Question | Admin",
      description: "Edit question and answers.",
    };
  } catch {
    return {
      title: "Edit Question | Admin",
    };
  }
}

export default async function AdminEditQuestionPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const { id: examId, questionId } = await params;

  let question: IQuestion | null = null;
  const examsList: Array<{ id: string; title: string }> = [];

  try {
    const [currentExamRes, directQRes, allExamsRes] = await Promise.all([
      getExamById(examId, session.token).catch(() => null),
      getQuestionById(questionId, session.token).catch(() => null),
      getExams({ limit: 100 }, session.token).catch(() => null),
    ]);

    if (currentExamRes?.status && currentExamRes.payload) {
      examsList.push({
        id: currentExamRes.payload.exam.id,
        title: currentExamRes.payload.exam.title,
      });
    }

    if (allExamsRes?.status && allExamsRes.payload) {
      for (const e of allExamsRes.payload.data) {
        if (!examsList.some((existing) => existing.id === e.id)) {
          examsList.push({ id: e.id, title: e.title });
        }
      }
    }

    if (directQRes?.status && directQRes.payload) {
      question = directQRes.payload.question;
    }

    // Fallback if getQuestionById is not standalone
    if (!question) {
      const examQuestionsRes = await getExamQuestions(examId, undefined, session.token).catch(() => null);
      if (examQuestionsRes?.status && examQuestionsRes.payload) {
        question =
          examQuestionsRes.payload.questions.find((q) => q.id === questionId) ?? null;
      }
    }
  } catch {
    notFound();
  }

  if (!question) {
    notFound();
  }

  return (
    <AdminQuestionFormRoute
      mode="edit"
      initialExamId={examId}
      initialQuestion={question}
      exams={examsList}
    />
  );
}

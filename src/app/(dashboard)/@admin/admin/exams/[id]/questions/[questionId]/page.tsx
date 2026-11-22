import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import {
  getExamById,
  getExamQuestions,
  getQuestionById,
} from "@/features/questions/lib/apis/questions.api";
import { AdminQuestionViewRoute } from "@/features/admin/routes/admin-question-view.route";
import type { IQuestion } from "@/shared/lib/types/question";
import type { IExamDetails } from "@/shared/lib/types/exam";

interface PageProps {
  params: Promise<{ id: string; questionId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, questionId } = await params;
  const session = await auth();

  try {
    let questionText = "Question Details";
    const qRes = await getQuestionById(questionId, session?.token).catch(() => null);
    if (qRes?.status && qRes.payload) {
      questionText = qRes.payload.question.text;
    } else {
      const questionsRes = await getExamQuestions(id, undefined, session?.token).catch(() => null);
      const found = questionsRes?.status && questionsRes.payload
        ? questionsRes.payload.questions.find((q) => q.id === questionId)
        : null;
      if (found) questionText = found.text;
    }

    return {
      title: `${questionText} | Admin Question View`,
      description: "View details of this question.",
    };
  } catch {
    return {
      title: "Question View | Admin",
    };
  }
}

export default async function AdminQuestionViewPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const { id: examId, questionId } = await params;

  let exam: IExamDetails | null = null;
  let question: IQuestion | null = null;

  try {
    const [examRes, directQRes] = await Promise.all([
      getExamById(examId, session.token).catch(() => null),
      getQuestionById(questionId, session.token).catch(() => null),
    ]);

    if (examRes?.status && examRes.payload) {
      exam = examRes.payload.exam;
    }

    if (directQRes?.status && directQRes.payload) {
      question = directQRes.payload.question;
    }

    // Fallback if getQuestionById is not a standalone endpoint: search in exam questions
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

  if (!exam || !question) {
    notFound();
  }

  return <AdminQuestionViewRoute question={question} exam={exam} />;
}

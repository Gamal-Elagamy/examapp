import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { getExamById } from "@/features/questions/lib/apis/questions.api";
import { getExams } from "@/features/exams/lib/apis/exams.api";
import { AdminQuestionFormRoute } from "@/features/admin/routes/admin-question-form.route";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();

  try {
    const res = await getExamById(id, session?.token).catch(() => null);
    const exam = res?.status && res.payload ? res.payload.exam : null;
    return {
      title: exam
        ? `Create Question - ${exam.title} | Admin`
        : "Create Question | Admin",
      description: "Create a new question for exam.",
    };
  } catch {
    return {
      title: "Create Question | Admin",
    };
  }
}

export default async function AdminCreateQuestionPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const { id: examId } = await params;

  const examsList: Array<{ id: string; title: string }> = [];

  try {
    const [currentExamRes, allExamsRes] = await Promise.all([
      getExamById(examId, session.token).catch(() => null),
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
  } catch {
    notFound();
  }

  return (
    <AdminQuestionFormRoute
      mode="create"
      initialExamId={examId}
      exams={examsList}
    />
  );
}

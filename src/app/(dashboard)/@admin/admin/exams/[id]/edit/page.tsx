import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { getExamById } from "@/features/exams/lib/apis/exams.api";
import { getExamQuestions } from "@/features/questions/lib/apis/questions.api";
import { getDiplomas } from "@/features/diplomas/lib/apis/diplomas.api";
import { AdminExamFormRoute } from "@/features/admin/routes/admin-exam-form.route";
import type { IExamDetails } from "@/shared/lib/types/exam";
import type { IQuestion } from "@/shared/lib/types/question";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();

  try {
    const res = await getExamById(id, session?.token);
    const exam = res.status && res.payload ? res.payload.exam : null;
    return {
      title: exam ? `Edit: ${exam.title} | Admin` : "Edit Exam | Admin",
      description: exam?.description || "Edit exam details and configuration.",
    };
  } catch {
    return {
      title: "Edit Exam | Admin",
    };
  }
}

export default async function AdminEditExamPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const { id } = await params;

  let exam: IExamDetails | null = null;
  let questions: IQuestion[] = [];
  let diplomas: { id: string; title: string }[] = [];

  try {
    const [examRes, questionsRes, diplomasRes] = await Promise.all([
      getExamById(id, session.token),
      getExamQuestions(id, undefined, session.token).catch(() => null),
      getDiplomas({ limit: 100 }, session.token).catch(() => null),
    ]);

    if (examRes.status && examRes.payload) {
      exam = examRes.payload.exam;
    }

    if (questionsRes?.status && questionsRes.payload) {
      questions = questionsRes.payload.questions;
    }

    if (diplomasRes?.status && diplomasRes.payload?.data) {
      diplomas = diplomasRes.payload.data.map((d) => ({
        id: d.id,
        title: d.title,
      }));
    }
  } catch {
    notFound();
  }

  if (!exam) {
    notFound();
  }

  return (
    <AdminExamFormRoute
      initialExam={exam}
      isEditing={true}
      initialQuestions={questions}
      diplomas={diplomas}
    />
  );
}

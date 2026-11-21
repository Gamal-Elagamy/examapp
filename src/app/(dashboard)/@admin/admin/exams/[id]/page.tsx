import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { getExamById } from "@/features/questions/lib/apis/questions.api";
import { getExamQuestions } from "@/features/questions/lib/apis/questions.api";
import { AdminExamViewRoute } from "@/features/admin/routes/admin-exam-view.route";
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
      title: exam ? `${exam.title} | Admin Exam View` : "Exam Details | Admin",
      description: exam?.description || "View exam details and questions.",
    };
  } catch {
    return {
      title: "Exam Details | Admin",
    };
  }
}

export default async function AdminExamViewPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const { id } = await params;

  let exam: IExamDetails | null = null;
  let questions: IQuestion[] = [];

  try {
    const [examRes, questionsRes] = await Promise.all([
      getExamById(id, session.token),
      getExamQuestions(id, undefined, session.token).catch(() => null),
    ]);

    if (examRes?.status && examRes.payload) {
      exam = examRes.payload.exam;
    }

    if (questionsRes?.status && questionsRes.payload) {
      questions = questionsRes.payload.questions;
    }
  } catch {
    notFound();
  }

  if (!exam) {
    notFound();
  }

  return <AdminExamViewRoute exam={exam} initialQuestions={questions} />;
}

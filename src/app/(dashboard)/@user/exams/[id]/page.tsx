import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamQuestionsRoute } from "@/features/questions/routes/exam-questions.route";

export const metadata: Metadata = {
  title: "Exam Questions",
  description: "Answer questions for the selected exam.",
};

interface ExamQuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamQuestionsPage({
  params,
}: ExamQuestionsPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <ExamQuestionsRoute examId={id} />;
}

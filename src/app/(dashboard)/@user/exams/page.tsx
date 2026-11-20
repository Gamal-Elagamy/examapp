import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/routes";
import { DiplomaExamsRoute } from "@/features/diplomas/routes/diploma-exams.route";

export const metadata: Metadata = {
  title: "Exams | Elevate Exam App",
  description: "View and take available exams for the selected diploma.",
};

interface ExamsPageProps {
  searchParams: Promise<{ diplomaId?: string }>;
}

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const { diplomaId } = await searchParams;

  if (!diplomaId) {
    redirect(ROUTES.HOME);
  }

  return <DiplomaExamsRoute diplomaId={diplomaId} />;
}

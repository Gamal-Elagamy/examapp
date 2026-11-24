import { redirect } from "next/navigation";
import { ROUTES } from "@/routes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamQuestionsRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(ROUTES.ADMIN.EXAM_DETAILS(id));
}

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { getDiplomas } from "@/features/diplomas/lib/apis/diplomas.api";
import { AdminExamFormRoute } from "@/features/admin/routes/admin-exam-form.route";

export const metadata: Metadata = {
  title: "Create New Exam | Admin",
  description: "Create a new exam in the administrative dashboard.",
};

export default async function AdminCreateExamPage() {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  // Fetch available diplomas for the dropdown
  let diplomas: { id: string; title: string }[] = [];
  try {
    const res = await getDiplomas({ limit: 100 }, session.token);
    if (res.status && res.payload?.data) {
      diplomas = res.payload.data.map((d) => ({ id: d.id, title: d.title }));
    }
  } catch {
    diplomas = [];
  }

  return (
    <AdminExamFormRoute
      isEditing={false}
      diplomas={diplomas}
    />
  );
}

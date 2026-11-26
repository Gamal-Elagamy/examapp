import type { Metadata } from "next";
import { auth } from "@/auth";
import { getExams } from "@/features/exams/lib/apis/exams.api";
import { AdminExamsRoute } from "@/features/admin/routes/admin-exams.route";
import type { IExamsPayload } from "@/shared/lib/types/exam";

export const metadata: Metadata = {
  title: "Admin Exams",
  description: "Manage, filter, and create exams across diplomas.",
};

export default async function AdminExamsPage() {
  const session = await auth();
  let initialData: IExamsPayload | undefined;

  if (session?.token) {
    try {
      const res = await getExams(
        { page: 1, limit: 12, sortBy: "title", sortOrder: "asc" },
        session.token,
      );
      if (res?.status && res?.payload) {
        initialData = res.payload;
      }
    } catch {
      // Fallback to client fetching
    }
  }

  return <AdminExamsRoute initialData={initialData} />;
}

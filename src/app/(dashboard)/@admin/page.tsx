import type { Metadata } from "next";
import { auth } from "@/auth";
import { getDiplomas } from "@/features/diplomas/lib/apis/diplomas.api";
import { AdminDiplomasRoute } from "@/features/admin/routes/admin-diplomas.route";
import type { IDiplomasPayload } from "@/shared/lib/types/diploma";

export const metadata: Metadata = {
  title: "Admin Diplomas | Elevate Exam App",
  description: "Manage diplomas, search, and filter certifications.",
};

export default async function AdminRootPage() {
  const session = await auth();
  let initialData: IDiplomasPayload | undefined;

  if (session?.token) {
    try {
      const res = await getDiplomas({ page: 1, limit: 20 }, session.token);
      if (res.status && res.payload) {
        initialData = res.payload;
      }
    } catch {
      // Client query fallback
    }
  }

  return <AdminDiplomasRoute initialData={initialData} />;
}

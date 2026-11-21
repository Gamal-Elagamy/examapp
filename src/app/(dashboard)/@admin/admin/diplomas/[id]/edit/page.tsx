import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getDiplomaById } from "@/features/diplomas/lib/apis/diplomas.api";
import { AdminDiplomaFormRoute } from "@/features/admin/routes/admin-diploma-form.route";

interface AdminEditDiplomaPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminEditDiplomaPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Diploma | Admin Elevate Exam App`,
    description: `Update diploma details for ID: ${id}`,
  };
}

export default async function AdminEditDiplomaPage({
  params,
}: AdminEditDiplomaPageProps) {
  const session = await auth();
  const { id } = await params;

  let diploma = null;
  try {
    const res = await getDiplomaById(id, session?.token);
    if (res?.status && res?.payload?.diploma) {
      diploma = res.payload.diploma;
    }
  } catch {
    notFound();
  }

  if (!diploma) {
    notFound();
  }

  return <AdminDiplomaFormRoute initialDiploma={diploma} isEditing />;
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { getDiplomaById } from "@/features/diplomas/lib/apis/diplomas.api";
import { AdminDiplomaFormRoute } from "@/features/admin/routes/admin-diploma-form.route";

interface AdminEditDiplomaPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit Diploma",
    description: "Update diploma details",
  };
}

export default async function AdminEditDiplomaPage({
  params,
}: AdminEditDiplomaPageProps) {
  const session = await auth();
  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }
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

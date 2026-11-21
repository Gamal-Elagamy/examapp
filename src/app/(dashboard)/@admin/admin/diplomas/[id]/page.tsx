import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDiplomaViewRoute } from "@/features/admin/routes/admin-diploma-view.route";

interface AdminDiplomaDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Diploma Details | Admin",
  description: "View diploma details, title, and description.",
};

export default async function AdminDiplomaDetailsPage({
  params,
}: AdminDiplomaDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <AdminDiplomaViewRoute id={id} />;
}

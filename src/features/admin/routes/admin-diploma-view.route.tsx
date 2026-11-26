import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { getDiplomaById } from "@/features/diplomas/lib/apis/diplomas.api";
import { AdminDiplomaView } from "../components/admin-diploma-view";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface AdminDiplomaViewRouteProps {
  id: string;
}

export async function AdminDiplomaViewRoute({ id }: AdminDiplomaViewRouteProps) {
  const session = await auth();
  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }
  let diploma: IDiploma | null = null;

  if (id) {
    try {
      const res = await getDiplomaById(id, session.token);
      if (res.status && res.payload?.diploma) {
        diploma = res.payload.diploma;
      }
    } catch {
      // Handled below
    }
  }

  if (!diploma) {
    notFound();
  }

  return <AdminDiplomaView diploma={diploma} />;
}

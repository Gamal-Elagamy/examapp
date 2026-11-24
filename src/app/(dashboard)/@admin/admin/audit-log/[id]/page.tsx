import { redirect, forbidden } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { getAuditLogById } from "@/features/audit-logs/lib/apis/audit-logs.api";
import { AuditLogDetailsRoute } from "@/features/audit-logs/routes/audit-log-details.route";
import type { IAuditLog } from "@/features/audit-logs/lib/types/audit-log";

export const metadata: Metadata = {
  title: "Audit Log Details | Admin Dashboard",
  description: "View system audit log entry details.",
};

interface AdminAuditLogDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAuditLogDetailsPage({
  params,
}: AdminAuditLogDetailsPageProps) {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const role = session.user?.role;
  const isAuthorized =
    role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;

  if (!isAuthorized) {
    forbidden();
  }

  const { id } = await params;
  let initialData: IAuditLog | undefined = undefined;

  try {
    const res = await getAuditLogById(id, session.token);
    if (res?.status && res.payload?.auditLog) {
      initialData = res.payload.auditLog;
    }
  } catch {
    // Graceful fallback to client query
  }

  return <AuditLogDetailsRoute id={id} initialData={initialData} />;
}

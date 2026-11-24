import { redirect, forbidden } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { getAuditLogs } from "@/features/audit-logs/lib/apis/audit-logs.api";
import { AuditLogsRoute } from "@/features/audit-logs/routes/audit-logs.route";
import type { IAuditLogsPayload } from "@/features/audit-logs/lib/types/audit-log";

export const metadata: Metadata = {
  title: "Audit Log | Admin Dashboard",
  description: "View and manage system audit logs and activities.",
};

export default async function AdminAuditLogPage() {
  const session = await auth();

  if (!session?.token) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  // Role-based access control: Only visible to admins and super admins
  const role = session.user?.role;
  const isAuthorized =
    role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;

  if (!isAuthorized) {
    forbidden();
  }

  let initialData: IAuditLogsPayload | undefined = undefined;

  try {
    const res = await getAuditLogs({ page: 1, limit: 20 }, session.token);
    if (res?.status && res.payload) {
      initialData = res.payload;
    }
  } catch {
    // Graceful fallback to client query
  }

  return <AuditLogsRoute initialData={initialData} />;
}

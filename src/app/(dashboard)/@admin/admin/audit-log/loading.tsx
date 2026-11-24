import { AuditLogsSkeleton } from "@/features/audit-logs/skeletons/audit-logs.skeleton";

export default function AdminAuditLogLoading() {
  return (
    <div className="py-2">
      <AuditLogsSkeleton />
    </div>
  );
}

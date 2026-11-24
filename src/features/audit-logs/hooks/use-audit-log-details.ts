import { useQuery } from "@tanstack/react-query";
import { getClientAuditLogById } from "../lib/apis/audit-logs.api";
import { auditLogKeys } from "../lib/apis/audit-logs.key";
import type { IAuditLog } from "../lib/types/audit-log";

export function useAuditLogDetails(id: string, initialData?: IAuditLog) {
  return useQuery({
    queryKey: auditLogKeys.detail(id),
    queryFn: () => getClientAuditLogById(id),
    initialData,
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

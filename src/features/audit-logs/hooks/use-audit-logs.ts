import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getClientAuditLogs } from "../lib/apis/audit-logs.api";
import { auditLogKeys } from "../lib/apis/audit-logs.key";
import type {
  GetAuditLogsParams,
  IAuditLogsPayload,
} from "../lib/types/audit-log";

export function useAuditLogs(
  params?: GetAuditLogsParams,
  initialData?: IAuditLogsPayload,
) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => getClientAuditLogs(params),
    initialData,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

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
  const isDefaultParams =
    params?.page === 1 &&
    !params?.category &&
    !params?.action &&
    !params?.actorUserId &&
    params?.sortBy === "createdAt" &&
    params?.sortOrder === "desc";

  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => getClientAuditLogs(params),
    initialData: isDefaultParams ? initialData : undefined,
    initialDataUpdatedAt: 0,
    placeholderData: keepPreviousData,
  });
}

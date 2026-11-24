import type { GetAuditLogsParams } from "../types/audit-log";

export const auditLogKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditLogKeys.all, "list"] as const,
  list: (params?: GetAuditLogsParams) => [...auditLogKeys.lists(), params] as const,
  details: () => [...auditLogKeys.all, "detail"] as const,
  detail: (id: string) => [...auditLogKeys.details(), id] as const,
  users: ["admin-users"] as const,
};

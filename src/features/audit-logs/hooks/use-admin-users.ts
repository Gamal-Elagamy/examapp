import { useQuery } from "@tanstack/react-query";
import { getClientAdminUsers } from "../lib/apis/audit-logs.api";
import { auditLogKeys } from "../lib/apis/audit-logs.key";
import type { GetAdminUsersParams } from "../lib/types/audit-log";

export function useAdminUsers(params?: GetAdminUsersParams) {
  return useQuery({
    queryKey: [...auditLogKeys.users, params],
    queryFn: () => getClientAdminUsers(params),
    staleTime: 5 * 60 * 1000,
  });
}

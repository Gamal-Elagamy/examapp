import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClientClearAllAuditLogs } from "../lib/apis/audit-logs.api";
import { auditLogKeys } from "../lib/apis/audit-logs.key";

export function useClearAuditLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getClientClearAllAuditLogs(),
    onSuccess: (data) => {
      toast.success(
        `Audit logs cleared successfully (${data.deletedCount ?? 0} deleted)`,
      );
      queryClient.invalidateQueries({ queryKey: auditLogKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear audit logs");
    },
  });
}

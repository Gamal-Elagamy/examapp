import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClientDeleteAuditLog } from "../lib/apis/audit-logs.api";
import { auditLogKeys } from "../lib/apis/audit-logs.key";

export function useDeleteAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => getClientDeleteAuditLog(id),
    onSuccess: () => {
      toast.success("Audit log entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: auditLogKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete audit log");
    },
  });
}

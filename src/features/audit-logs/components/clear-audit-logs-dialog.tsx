"use client";

import { useCallback } from "react";
import { useClearAuditLogs } from "../hooks/use-clear-audit-logs";
import { ConfirmDeleteDialog } from "@/shared/components/confirm-delete-dialog";

interface ClearAuditLogsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ClearAuditLogsDialog({
  isOpen,
  onClose,
  onSuccess,
}: ClearAuditLogsDialogProps) {
  const { mutate: clearLogs, isPending, error, reset } = useClearAuditLogs();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleClear = () => {
    clearLogs(undefined, {
      onSuccess: () => {
        handleClose();
        onSuccess?.();
      },
    });
  };

  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleClear}
      title="Are you sure you want to clear all logs?"
      description="This action is permanent and cannot be undone."
      confirmText="Yes, clear"
      cancelText="Cancel"
      isPending={isPending}
      error={error ? error.message : null}
    />
  );
}

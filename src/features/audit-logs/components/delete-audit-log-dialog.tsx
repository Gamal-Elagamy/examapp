"use client";

import { useCallback } from "react";
import { useDeleteAuditLog } from "../hooks/use-delete-audit-log";
import { ConfirmDeleteDialog } from "@/shared/components/confirm-delete-dialog";
import type { IAuditLog } from "../lib/types/audit-log";

interface DeleteAuditLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  log: IAuditLog | null;
  onSuccess?: () => void;
}

export function DeleteAuditLogDialog({
  isOpen,
  onClose,
  log,
  onSuccess,
}: DeleteAuditLogDialogProps) {
  const { mutate: deleteLog, isPending, error, reset } = useDeleteAuditLog();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!log) return null;

  const handleDelete = () => {
    deleteLog(log.id, {
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
      onConfirm={handleDelete}
      title="Are you sure you want to delete this log?"
      description="This entry will be permanently removed from the audit log."
      confirmText="Yes, delete"
      cancelText="Cancel"
      isPending={isPending}
      error={error ? error.message : null}
    />
  );
}

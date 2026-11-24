"use client";

import { useCallback } from "react";
import { useDeleteDiploma } from "@/features/diplomas/hooks/use-delete-diploma";
import { ConfirmDeleteDialog } from "@/shared/components/confirm-delete-dialog";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface DeleteDiplomaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  diploma: IDiploma | null;
  onSuccess?: () => void;
}

export function DeleteDiplomaDialog({
  isOpen,
  onClose,
  diploma,
  onSuccess,
}: DeleteDiplomaDialogProps) {
  const { mutate: deleteDiploma, isPending, error, reset } = useDeleteDiploma();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!diploma) return null;

  const handleDelete = () => {
    deleteDiploma(diploma.id, {
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
      title="Are you sure you want to delete this diploma?"
      description={`This action will permanently delete "${diploma.title}" and all associated exams.`}
      confirmText="Yes, delete"
      cancelText="Cancel"
      isPending={isPending}
      error={error ? error.message : null}
    />
  );
}

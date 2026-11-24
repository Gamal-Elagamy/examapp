"use client";

import { useCallback } from "react";
import { useDeleteExam } from "@/features/exams/hooks/use-delete-exam";
import { ConfirmDeleteDialog } from "@/shared/components/confirm-delete-dialog";
import type { IExam } from "@/shared/lib/types/exam";

interface DeleteExamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam: IExam | null;
  onSuccess?: () => void;
}

export function DeleteExamDialog({
  isOpen,
  onClose,
  exam,
  onSuccess,
}: DeleteExamDialogProps) {
  const { mutate: deleteExam, isPending, error, reset } = useDeleteExam();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!exam) return null;

  const handleDelete = () => {
    deleteExam(exam.id, {
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
      title="Are you sure you want to delete this exam?"
      description={`This action will permanently delete "${exam.title}" and all its questions.`}
      confirmText="Yes, delete"
      cancelText="Cancel"
      isPending={isPending}
      error={error ? error.message : null}
    />
  );
}

"use client";

import { useCallback } from "react";
import { useDeleteQuestion } from "@/features/questions/hooks/use-delete-question";
import { ConfirmDeleteDialog } from "@/shared/components/confirm-delete-dialog";
import type { IQuestion } from "@/shared/lib/types/question";

interface DeleteQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  question: IQuestion | null;
  onSuccess?: () => void;
}

export function DeleteQuestionDialog({
  isOpen,
  onClose,
  question,
  onSuccess,
}: DeleteQuestionDialogProps) {
  const { mutate: deleteQuestion, isPending, error, reset } = useDeleteQuestion();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!question) return null;

  const handleDelete = () => {
    deleteQuestion(question.id, {
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
      title="Are you sure you want to delete this question?"
      description="This action will permanently delete this question."
      confirmText="Yes, delete"
      cancelText="Cancel"
      isPending={isPending}
      error={error ? error.message : null}
    />
  );
}

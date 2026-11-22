"use client";

import { useEffect, useCallback } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteQuestion } from "@/features/questions/hooks/use-delete-question";
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

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isPending) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, handleClose]);

  if (!isOpen || !question) return null;

  const handleDelete = () => {
    deleteQuestion(question.id, {
      onSuccess: () => {
        handleClose();
        onSuccess?.();
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-question-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/60 text-center">
        <button
          type="button"
          onClick={handleClose}
          disabled={isPending}
          aria-label="Close dialog"
          className="absolute top-5 inset-e-5 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer rounded-md hover:bg-slate-100 disabled:opacity-50"
        >
          <X className="size-4.5" />
        </button>

        <div className="size-16 rounded-full bg-red-100/90 border-4 border-red-50 flex items-center justify-center text-red-500 mx-auto mb-5 shadow-xs">
          <AlertTriangle className="size-8 stroke-2" />
        </div>

        <h3
          id="delete-question-title"
          className="text-base sm:text-lg font-bold text-red-600 font-mono tracking-tight"
        >
          Are you sure you want to delete this question?
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-2 mb-1">
          &quot;{question.text}&quot;
        </p>
        <p className="text-xs text-muted-foreground font-mono mb-6">
          This action is permanent and cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
            {error.message || "Failed to delete question"}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-foreground font-medium text-xs sm:text-sm font-mono transition-colors cursor-pointer select-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm font-mono transition-colors shadow-xs hover:shadow-sm cursor-pointer select-none flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useCallback } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteDiploma } from "@/features/diplomas/hooks/use-delete-diploma";
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

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isPending) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, handleClose]);

  if (!isOpen || !diploma) return null;

  const handleDelete = () => {
    deleteDiploma(diploma.id, {
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
      aria-labelledby="delete-diploma-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/60 text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isPending}
          aria-label="Close dialog"
          className="absolute top-5 inset-e-5 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer rounded-md hover:bg-slate-100 disabled:opacity-50"
        >
          <X className="size-4.5" />
        </button>

        {/* Warning Icon with Pink/Red Ring */}
        <div className="size-16 rounded-full bg-red-100/90 border-4 border-red-50 flex items-center justify-center text-red-500 mx-auto mb-5 shadow-xs">
          <AlertTriangle className="size-8 stroke-2" />
        </div>

        {/* Title & Description */}
        <h3
          id="delete-diploma-title"
          className="text-base sm:text-lg font-bold text-red-600 font-mono tracking-tight"
        >
          Are you sure you want to delete this diploma?
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-2 mb-1">
          &quot;{diploma.title}&quot;
        </p>
        <p className="text-xs text-muted-foreground font-mono mb-6">
          This action is permanent and cannot be undone.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
            {error.message || "Failed to delete diploma"}
          </div>
        )}

        {/* Bottom Actions: Cancel & Yes, delete */}
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

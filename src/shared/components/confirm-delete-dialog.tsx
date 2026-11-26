"use client";

import { useEffect } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

export interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  error?: string | null;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description = "This action is permanent and cannot be undone.",
  confirmText = "Yes, delete",
  cancelText = "Cancel",
  isPending = false,
  error = null,
}: ConfirmDeleteDialogProps) {
  useEffect(() => {
  function handleKeyDown(e: globalThis.KeyboardEvent) {
  if (e.key === "Escape" && isOpen && !isPending) {
  onClose();
  }
  }
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  if (!isOpen) return null;

  return (
  <div
  role="dialog"
  aria-modal="true"
  aria-label={title}
  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
  >
  <div className="bg-white max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/60 text-center font-mono">
  {/* Close Button */}
  <button
  type="button"
  onClick={onClose}
  disabled={isPending}
  aria-label="Close dialog"
  className="absolute top-5 inset-e-5 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer hover:bg-slate-100 disabled:opacity-50"
  >
  <X className="size-4.5" />
  </button>

  {/* Warning Icon with Pink/Red Ring matching design */}
  <div className="size-20 bg-red-50/90 flex items-center justify-center mx-auto mb-5">
  <div className="size-14 bg-red-100/90 flex items-center justify-center text-red-500 shadow-2xs">
  <AlertTriangle className="size-7 stroke-2" />
  </div>
  </div>

  {/* Title & Description */}
  <h3 className="text-base sm:text-lg font-bold text-red-600 font-mono tracking-tight">
  {title}
  </h3>
  {description && (
  <p className="text-xs text-muted-foreground font-mono mt-2 mb-6 leading-relaxed">
  {description}
  </p>
  )}

  {/* Error message */}
  {error && (
  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono text-start">
  {error}
  </div>
  )}

  {/* Action Buttons */}
  <div className="border-t border-border/60 pt-4 flex items-center justify-center gap-3">
  <button
  type="button"
  onClick={onClose}
  disabled={isPending}
  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
  >
  {cancelText}
  </button>
  <button
  type="button"
  onClick={onConfirm}
  disabled={isPending}
  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
  >
  {isPending && <Loader2 className="size-3.5 animate-spin" />}
  <span>{confirmText}</span>
  </button>
  </div>
  </div>
  </div>
  );
}

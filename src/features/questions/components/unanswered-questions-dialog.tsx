"use client";

import { useEffect } from "react";
import { AlertTriangle, X, Loader2, ArrowRight } from "lucide-react";

export interface UnansweredQuestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredCount: number;
  isSubmitting?: boolean;
}

export function UnansweredQuestionsDialog({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  isSubmitting = false,
}: UnansweredQuestionsDialogProps) {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unanswered-dialog-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none font-mono"
    >
      <div className="bg-white max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className="absolute top-4 inset-e-4 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer hover:bg-slate-100 disabled:opacity-50"
        >
          <X className="size-4.5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="size-14 mx-auto mb-4 bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
          <AlertTriangle className="size-7" />
        </div>

        {/* Dialog Title */}
        <h3
          id="unanswered-dialog-title"
          className="text-lg font-bold text-slate-900 text-center tracking-tight"
        >
          Unanswered Questions
        </h3>

        {/* Statistics Pill */}
        <div className="my-4 p-3 bg-slate-50 border border-border flex items-center justify-around text-xs">
          <div className="text-center">
            <span className="block text-slate-500 font-medium">Total</span>
            <span className="text-sm font-bold text-slate-800">{totalQuestions}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-center">
            <span className="block text-emerald-600 font-medium">Answered</span>
            <span className="text-sm font-bold text-emerald-700">{answeredCount}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-center">
            <span className="block text-amber-600 font-medium">Remaining</span>
            <span className="text-sm font-bold text-amber-700">{unansweredCount}</span>
          </div>
        </div>

        {/* Description Body */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed mb-6">
          You have <strong className="text-slate-800">{unansweredCount}</strong> unanswered{" "}
          {unansweredCount === 1 ? "question" : "questions"}. If you submit now, unanswered questions will be marked as incorrect. Are you sure you want to finish the exam?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-2.5 px-4 text-xs font-semibold border border-border bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Review Questions
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-2.5 px-4 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Anyway</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

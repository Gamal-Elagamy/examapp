"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { ROUTES } from "@/routes";
import { getClientDeleteAccount } from "../lib/apis/account.api";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await getClientDeleteAccount();
      // On success: sign out user and redirect to login
      await signOut({ callbackUrl: ROUTES.AUTH.LOGIN });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete account";
      setErrorMessage(msg);
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/60 text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close dialog"
          className="absolute top-5 inset-e-5 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer rounded-md hover:bg-slate-100"
        >
          <X className="size-4.5" />
        </button>

        {/* Warning Icon with Pink/Red Aura Ring */}
        <div className="size-16 rounded-full bg-red-100/90 border-4 border-red-50 flex items-center justify-center text-red-500 mx-auto mb-5 shadow-xs">
          <AlertTriangle className="size-8 stroke-2" />
        </div>

        {/* Title & Description */}
        <h3
          id="delete-account-title"
          className="text-base sm:text-lg font-bold text-red-600 font-mono tracking-tight"
        >
          Are you sure you want to delete your account?
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-2 mb-6">
          This action is permanent and cannot be undone.
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
            {errorMessage}
          </div>
        )}

        {/* Bottom Actions: Cancel & Yes, delete */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-foreground font-medium text-xs sm:text-sm font-mono transition-colors cursor-pointer select-none disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            <span>Yes, delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

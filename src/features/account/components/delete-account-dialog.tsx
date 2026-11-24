"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/routes";
import { getClientDeleteAccount } from "../lib/apis/account.api";
import { ConfirmDeleteDialog } from "@/shared/components/confirm-delete-dialog";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await getClientDeleteAccount();
      await signOut({ callbackUrl: ROUTES.AUTH.LOGIN });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete account";
      setErrorMessage(msg);
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Are you sure you want to delete your account?"
      description="This action is permanent and cannot be undone. All your data will be erased."
      confirmText="Yes, delete account"
      cancelText="Cancel"
      isPending={isDeleting}
      error={errorMessage}
    />
  );
}

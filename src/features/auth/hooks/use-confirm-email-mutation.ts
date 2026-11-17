"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  confirmEmailVerificationApi,
  type ConfirmEmailVerificationPayload,
} from "../lib/apis/auth.api";

export function useConfirmEmailMutation() {
  return useMutation({
    mutationFn: (payload: ConfirmEmailVerificationPayload) =>
      confirmEmailVerificationApi(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Email verified successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid or expired verification code");
    },
  });
}

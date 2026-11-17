"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  forgotPasswordApi,
  type ForgotPasswordPayload,
} from "../lib/apis/auth.api";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordApi(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset instructions sent to your email.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send password reset email");
    },
  });
}

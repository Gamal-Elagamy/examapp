"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  sendEmailVerificationApi,
  type SendEmailVerificationPayload,
} from "../lib/apis/auth.api";

export function useSendEmailMutation() {
  return useMutation({
    mutationFn: (payload: SendEmailVerificationPayload) =>
      sendEmailVerificationApi(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Verification code sent to your email.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification code");
    },
  });
}

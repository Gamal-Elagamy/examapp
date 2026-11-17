"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/routes";
import {
  resetPasswordApi,
  type ResetPasswordPayload,
} from "../lib/apis/auth.api";

export function useResetPasswordMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully! Please sign in.");
      router.push(ROUTES.AUTH.LOGIN);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
}

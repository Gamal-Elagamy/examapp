"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/routes";
import { registerApi, type RegisterPayload } from "../lib/apis/auth.api";

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await registerApi(data);

      // Automatically sign in upon successful registration
      const signInResult = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      if (!signInResult?.ok) {
        throw new Error(signInResult?.error || "Registered, but failed to log in automatically");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push(ROUTES.HOME);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    },
  });
}

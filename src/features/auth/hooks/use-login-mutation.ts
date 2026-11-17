"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/routes";
import type { LoginFormData } from "../lib/schemas/login.schema";

export function useLoginMutation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.HOME;

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      if (!result?.ok) {
        throw new Error(result?.error || "Something went wrong");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Signed in successfully!");
      router.push(callbackUrl);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });
}

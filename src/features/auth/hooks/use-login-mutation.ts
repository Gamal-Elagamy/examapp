"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import type { LoginFormData } from "../lib/schemas/login.schema";

export function useLoginMutation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

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
    onSuccess: async () => {
      toast.success("Signed in successfully!");

      const session = await getSession();
      const userRole = session?.user?.role;
      const isAdmin =
        userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;

      // Sanitize callbackUrl to prevent open redirects (allow relative paths only)
      const safeCallbackUrl =
        callbackUrl &&
        callbackUrl.startsWith("/") &&
        !callbackUrl.startsWith("//")
          ? callbackUrl
          : ROUTES.HOME;

      if (isAdmin && (safeCallbackUrl === "/" || safeCallbackUrl === ROUTES.HOME)) {
        router.push(ROUTES.ADMIN.DIPLOMAS);
      } else {
        router.push(safeCallbackUrl);
      }
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { ROUTES } from "@/routes";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../lib/schemas/forgot-password.schema";
import { useForgotPasswordMutation } from "../hooks/use-forgot-password-mutation";

export function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { mutate, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordFormData) {
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${ROUTES.AUTH.RESET_PASSWORD}`
        : `http://localhost:3000${ROUTES.AUTH.RESET_PASSWORD}`;

    mutate(
      {
        email: values.email,
        redirectUrl,
      },
      {
        onSuccess: () => {
          setSubmittedEmail(values.email);
          setIsSent(true);
        },
      },
    );
  }

  // Screen 2: Password Reset Sent
  if (isSent) {
    return (
      <div className="w-full space-y-6">
        {/* Back arrow button */}
        <div>
          <button
            type="button"
            onClick={() => setIsSent(false)}
            className="flex items-center justify-center size-9 rounded-md border border-input bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Password Reset Sent
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              We have sent a password reset link to:{" "}
              <span className="text-primary font-medium">{submittedEmail}</span>.
            </p>
            <p>
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <p className="text-muted-foreground/80 pt-1">
              If you don&apos;t see the email within a few minutes, check your spam or junk folder.
            </p>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground pt-4">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            Create yours
          </Link>
        </p>
      </div>
    );
  }

  // Screen 1: Forgot Password Input Form
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Forgot Password
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Don&apos;t worry, we will help you recover your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-medium text-foreground">
                  Email <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    autoComplete="email"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 rounded-md text-sm transition-colors cursor-pointer mt-2"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Next >"}
          </Button>

          <p className="text-center text-xs sm:text-sm text-muted-foreground pt-3">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Create yours
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}

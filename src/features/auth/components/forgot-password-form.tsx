"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
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
  const [resendCooldown, setResendCooldown] = useState(60);

  const { mutate, isPending } = useForgotPasswordMutation();

  useEffect(() => {
  if (!isSent || resendCooldown <= 0) return;
  const interval = setInterval(() => {
  setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);
  return () => clearInterval(interval);
  }, [isSent, resendCooldown]);

  const handleResend = () => {
  if (resendCooldown > 0 || isPending || !submittedEmail) return;
  const redirectUrl =
  typeof window !== "undefined"
  ? `${window.location.origin}${ROUTES.AUTH.RESET_PASSWORD}`
  : `http://localhost:3000${ROUTES.AUTH.RESET_PASSWORD}`;

  mutate(
  { email: submittedEmail, redirectUrl },
  {
  onSuccess: () => {
  setResendCooldown(60);
  },
  },
  );
  };

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
  className="flex items-center justify-center size-9 border border-input bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
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

  {/* Resend Action with Cooldown */}
  <div className="pt-2">
  <Button
  type="button"
  variant="outline"
  disabled={resendCooldown > 0 || isPending}
  onClick={handleResend}
  className="w-full h-11 text-xs sm:text-sm font-medium"
  >
  {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
  {resendCooldown > 0
  ? `Resend email in ${resendCooldown}s`
  : "Resend password reset email"}
  </Button>
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
  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 text-sm transition-colors cursor-pointer mt-2"
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

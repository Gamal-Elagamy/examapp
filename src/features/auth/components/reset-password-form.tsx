"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
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
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../lib/schemas/reset-password.schema";
import { useResetPasswordMutation } from "../hooks/use-reset-password-mutation";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isPending } = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
  resolver: zodResolver(resetPasswordSchema),
  defaultValues: {
  token: token,
  newPassword: "",
  confirmPassword: "",
  },
  });

  function onSubmit(values: ResetPasswordFormData) {
  mutate({
  token: values.token || token,
  newPassword: values.newPassword,
  confirmPassword: values.confirmPassword,
  });
  }

  return (
  <div className="w-full space-y-6">
  <div className="space-y-1">
  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
  Create a New Password
  </h2>
  <p className="text-xs sm:text-sm text-muted-foreground">
  Create a new strong password for your account.
  </p>
  </div>

  {!token && (
  <div className="p-3.5 text-xs sm:text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20 flex flex-col gap-2">
  <span>
  Invalid or missing password reset token. Please request a new password reset link.
  </span>
  <Link
  href={ROUTES.AUTH.FORGOT_PASSWORD}
  className="text-xs font-bold underline hover:opacity-80"
  >
  Go to Forgot Password →
  </Link>
  </div>
  )}

  <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
  {/* New Password */}
  <FormField
  control={form.control}
  name="newPassword"
  render={({ field }) => (
  <FormItem className="space-y-1.5">
  <FormLabel className="text-sm font-medium text-foreground">
  New Password <span className="text-destructive">*</span>
  </FormLabel>
  <FormControl>
  <div className="relative">
  <Input
  type={showPassword ? "text" : "password"}
  placeholder="••••••••"
  autoComplete="new-password"
  disabled={isPending}
  className="pe-10"
  {...field}
  />
  <button
  type="button"
  onClick={() => setShowPassword((prev) => !prev)}
  className="absolute inset-y-0 inset-e-0 flex items-center pe-3 text-muted-foreground hover:text-foreground focus:outline-hidden cursor-pointer"
  aria-label={showPassword ? "Hide password" : "Show password"}
  >
  {showPassword ? (
  <EyeOff className="size-4" />
  ) : (
  <Eye className="size-4" />
  )}
  </button>
  </div>
  </FormControl>
  <FormMessage className="text-xs text-destructive" />
  </FormItem>
  )}
  />

  {/* Confirm New Password */}
  <FormField
  control={form.control}
  name="confirmPassword"
  render={({ field }) => (
  <FormItem className="space-y-1.5">
  <FormLabel className="text-sm font-medium text-foreground">
  Confirm New Password <span className="text-destructive">*</span>
  </FormLabel>
  <FormControl>
  <div className="relative">
  <Input
  type={showConfirmPassword ? "text" : "password"}
  placeholder="••••••••"
  autoComplete="new-password"
  disabled={isPending}
  className="pe-10"
  {...field}
  />
  <button
  type="button"
  onClick={() => setShowConfirmPassword((prev) => !prev)}
  className="absolute inset-y-0 inset-e-0 flex items-center pe-3 text-muted-foreground hover:text-foreground focus:outline-hidden cursor-pointer"
  aria-label={
  showConfirmPassword ? "Hide password" : "Show password"
  }
  >
  {showConfirmPassword ? (
  <EyeOff className="size-4" />
  ) : (
  <Eye className="size-4" />
  )}
  </button>
  </div>
  </FormControl>
  <FormMessage className="text-xs text-destructive" />
  </FormItem>
  )}
  />

  <Button
  type="submit"
  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 text-sm transition-colors mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
  disabled={isPending || !token}
  >
  {isPending ? "Resetting Password..." : "Reset Password"}
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

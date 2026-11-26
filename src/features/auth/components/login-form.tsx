"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
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
import { loginSchema, type LoginFormData } from "../lib/schemas/login.schema";
import { useLoginMutation } from "../hooks/use-login-mutation";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error, isError } = useLoginMutation();

  const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
  username: "",
  password: "",
  },
  });

  function onSubmit(values: LoginFormData) {
  mutate(values);
  }

  return (
  <div className="w-full">
  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
  Login
  </h2>

  <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
  <FormField
  control={form.control}
  name="username"
  render={({ field }) => (
  <FormItem className="space-y-1.5">
  <FormLabel className="text-sm font-medium text-foreground">
  Username <span className="text-destructive">*</span>
  </FormLabel>
  <FormControl>
  <Input
  placeholder="user123"
  autoComplete="username"
  disabled={isPending}
  {...field}
  />
  </FormControl>
  <FormMessage className="text-xs text-destructive" />
  </FormItem>
  )}
  />

  <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
  <FormItem className="space-y-1.5">
  <FormLabel className="text-sm font-medium text-foreground">
  Password <span className="text-destructive">*</span>
  </FormLabel>
  <FormControl>
  <div className="relative">
  <Input
  type={showPassword ? "text" : "password"}
  placeholder="••••••••"
  autoComplete="current-password"
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

  <div className="flex justify-end pt-0.5">
  <Link
  href={ROUTES.AUTH.FORGOT_PASSWORD}
  className="text-xs text-primary hover:underline font-normal cursor-pointer"
  >
  Forgot your password?
  </Link>
  </div>

  {/* Global / Server Error Alert */}
  {isError && (
  <div
  role="alert"
  className="flex items-center justify-center gap-2 border border-brand-red-300 bg-brand-red-50 px-3 py-2 text-xs font-medium text-destructive transition-all animate-in fade-in-50"
  >
  <AlertCircle className="size-4 shrink-0 text-destructive" />
  <span>{error?.message || "Something went wrong"}</span>
  </div>
  )}

  <Button
  type="submit"
  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 text-sm transition-colors mt-2 cursor-pointer"
  disabled={isPending}
  >
  {isPending ? "Logging in..." : "Login"}
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

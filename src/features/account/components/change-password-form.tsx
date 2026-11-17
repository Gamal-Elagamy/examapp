"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Current password must be at least 6 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    rePassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      rePassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          password: values.password,
          rePassword: values.rePassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Failed to change password");
      }

      setFeedbackMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      setFeedbackMessage({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
      {/* Feedback Message */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      {/* Current Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="oldPassword"
          className="block text-xs font-mono text-muted-foreground select-none"
        >
          Current Password
        </label>
        <div className="relative">
          <input
            id="oldPassword"
            type={showOldPassword ? "text" : "password"}
            {...register("oldPassword")}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary pe-10 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword((prev) => !prev)}
            aria-label={showOldPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showOldPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.oldPassword && (
          <p className="text-xs text-destructive">{errors.oldPassword.message}</p>
        )}
      </div>

      {/* New Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-mono text-muted-foreground select-none"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showNewPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary pe-10 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm New Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="rePassword"
          className="block text-xs font-mono text-muted-foreground select-none"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="rePassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("rePassword")}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary pe-10 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.rePassword && (
          <p className="text-xs text-destructive">{errors.rePassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          <span>Update Password</span>
        </button>
      </div>
    </form>
  );
}

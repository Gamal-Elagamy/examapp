"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { ROUTES } from "@/routes";
import { getClientChangePassword } from "../lib/apis/account.api";

const changePasswordSchema = z
  .object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
  } = useForm<ChangePasswordFormValues>({
  resolver: zodResolver(changePasswordSchema),
  defaultValues: {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
  setIsSubmitting(true);
  setErrorMessage(null);

  try {
  const res = await getClientChangePassword({
  currentPassword: values.currentPassword,
  newPassword: values.newPassword,
  confirmPassword: values.confirmPassword,
  });

  toast.success(
  res.message || "Password updated successfully! Please log in again.",
  );
  reset();
  await signOut({ callbackUrl: ROUTES.AUTH.LOGIN });
  } catch (err) {
  const msg = err instanceof Error ? err.message : "Something went wrong";
  setErrorMessage(msg);
  toast.error(msg);
  } finally {
  setIsSubmitting(false);
  }
  };

  return (
  <div className="relative">
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
  {/* Current Password Field */}
  <div className="space-y-1.5">
  <label
  htmlFor="currentPassword"
  className="block text-xs font-mono text-muted-foreground select-none"
  >
  Current Password
  </label>
  <div className="relative">
  <input
  id="currentPassword"
  type={showCurrentPassword ? "text" : "password"}
  {...register("currentPassword")}
  placeholder="••••••••"
  className="w-full px-4 py-2.5 border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary pe-10 transition-colors font-mono"
  />
  <button
  type="button"
  onClick={() => setShowCurrentPassword((prev) => !prev)}
  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
  className="absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
  >
  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
  </button>
  </div>
  {errors.currentPassword && (
  <p className="text-xs text-destructive font-mono">{errors.currentPassword.message}</p>
  )}
  </div>

  {/* New Password Field */}
  <div className="space-y-1.5">
  <label
  htmlFor="newPassword"
  className="block text-xs font-mono text-muted-foreground select-none"
  >
  New Password
  </label>
  <div className="relative">
  <input
  id="newPassword"
  type={showNewPassword ? "text" : "password"}
  {...register("newPassword")}
  placeholder="••••••••"
  className="w-full px-4 py-2.5 border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary pe-10 transition-colors font-mono"
  />
  <button
  type="button"
  onClick={() => setShowNewPassword((prev) => !prev)}
  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
  className="absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
  >
  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
  </button>
  </div>
  {errors.newPassword && (
  <p className="text-xs text-destructive font-mono">{errors.newPassword.message}</p>
  )}
  </div>

  {/* Confirm New Password Field */}
  <div className="space-y-1.5">
  <label
  htmlFor="confirmPassword"
  className="block text-xs font-mono text-muted-foreground select-none"
  >
  Confirm New Password
  </label>
  <div className="relative">
  <input
  id="confirmPassword"
  type={showConfirmPassword ? "text" : "password"}
  {...register("confirmPassword")}
  placeholder="••••••••"
  className="w-full px-4 py-2.5 border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary pe-10 transition-colors font-mono"
  />
  <button
  type="button"
  onClick={() => setShowConfirmPassword((prev) => !prev)}
  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
  className="absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
  >
  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
  </button>
  </div>
  {errors.confirmPassword && (
  <p className="text-xs text-destructive font-mono">{errors.confirmPassword.message}</p>
  )}
  </div>

  {/* Error Banner matching Screenshot 1 */}
  {errorMessage && (
  <div
  role="alert"
  className="w-full p-3 border border-red-300 bg-red-50/80 text-destructive text-xs font-mono flex items-center justify-center gap-2 animate-in fade-in-50"
  >
  <XCircle className="size-4 shrink-0 text-destructive" />
  <span>{errorMessage}</span>
  </div>
  )}

  {/* Submit Button: Full-width matching Screenshot */}
  <div className="pt-2">
  <button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 px-8 bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
  >
  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
  <span>Update Password</span>
  </button>
  </div>
  </form>
  </div>
  );
}

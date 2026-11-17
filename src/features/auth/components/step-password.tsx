"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  passwordStepSchema,
  type PasswordStepData,
} from "../lib/schemas/register.schema";

interface StepPasswordProps {
  isPending: boolean;
  onComplete: (values: PasswordStepData) => void;
}

export function StepPassword({ isPending, onComplete }: StepPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordStepData>({
    resolver: zodResolver(passwordStepSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: PasswordStepData) {
    onComplete(values);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-primary">
          Create a strong password
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Password */}
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-medium text-foreground">
                  Confirm Password <span className="text-destructive">*</span>
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
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 rounded-md text-sm transition-colors mt-2 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

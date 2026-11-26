"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  emailStepSchema,
  type EmailStepData,
} from "../lib/schemas/register.schema";
import { useSendEmailMutation } from "../hooks/use-send-email-mutation";

interface StepEmailProps {
  initialEmail: string;
  autoFocusInput?: boolean;
  onNext: (email: string) => void;
  onTimerStart: () => void;
}

export function StepEmail({
  initialEmail,
  autoFocusInput = false,
  onNext,
  onTimerStart,
}: StepEmailProps) {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending } = useSendEmailMutation();

  const form = useForm<EmailStepData>({
  resolver: zodResolver(emailStepSchema),
  defaultValues: {
  email: initialEmail || "",
  },
  });

  useEffect(() => {
  if (autoFocusInput && emailInputRef.current) {
  emailInputRef.current.focus();
  }
  }, [autoFocusInput]);

  function onSubmit(values: EmailStepData) {
  mutate(
  { email: values.email },
  {
  onSuccess: () => {
  onTimerStart();
  onNext(values.email);
  },
  },
  );
  }

  return (
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
  ref={(e) => {
  field.ref(e);
  emailInputRef.current = e;
  }}
  />
  </FormControl>
  <FormMessage className="text-xs text-destructive" />
  </FormItem>
  )}
  />

  <Button
  type="submit"
  className="w-full bg-accent/60 hover:bg-accent border border-primary/20 text-primary font-medium py-2.5 text-sm transition-colors mt-2 cursor-pointer"
  disabled={isPending}
  >
  {isPending ? "Sending code..." : "Next >"}
  </Button>
  </form>
  </Form>
  );
}

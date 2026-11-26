"use client";

import { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from "react";
import { Button } from "@/shared/ui/button";
import { useConfirmEmailMutation } from "../hooks/use-confirm-email-mutation";
import { useSendEmailMutation } from "../hooks/use-send-email-mutation";
import { otpStepSchema } from "../lib/schemas/register.schema";

interface StepOtpProps {
  email: string;
  remainingSeconds: number;
  canResend: boolean;
  onResendCode: () => void;
  onEditEmail: () => void;
  onNext: (code: string) => void;
}

export function StepOtp({
  email,
  remainingSeconds,
  canResend,
  onResendCode,
  onEditEmail,
  onNext,
}: StepOtpProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOtp, isPending: isVerifying } = useConfirmEmailMutation();
  const { mutate: resendEmail, isPending: isResending } = useSendEmailMutation();

  // Auto-focus first input on mount
  useEffect(() => {
  inputRefs.current[0]?.focus();
  }, []);

  function handleDigitChange(index: number, value: string) {
  const raw = value.replace(/\D/g, "");
  const char = raw.slice(-1);
  const newDigits = [...digits];
  newDigits[index] = char;
  setDigits(newDigits);

  // Auto-advance
  if (char && index < 5) {
  inputRefs.current[index + 1]?.focus();
  }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Backspace" && !digits[index] && index > 0) {
  inputRefs.current[index - 1]?.focus();
  }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").trim();
  if (!pasteData) return;

  const chars = pasteData.slice(0, 6).split("");
  const newDigits = [...digits];
  chars.forEach((c, i) => {
  newDigits[i] = c;
  });
  setDigits(newDigits);

  const focusIndex = Math.min(chars.length, 5);
  inputRefs.current[focusIndex]?.focus();
  }

  function handleResend() {
  if (!canResend || isResending) return;
  resendEmail(
  { email },
  {
  onSuccess: () => {
  onResendCode();
  },
  },
  );
  }

  function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const code = digits.join("");
  const result = otpStepSchema.safeParse({ code });
  if (!result.success) return;

  verifyOtp(
  { email, code },
  {
  onSuccess: () => {
  onNext(code);
  },
  },
  );
  }

  const isComplete = digits.join("").length === 6 && /^\d{6}$/.test(digits.join(""));

  return (
  <div className="space-y-6">
  <div className="space-y-1">
  <h3 className="text-base font-semibold text-primary">Verify OTP</h3>
  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
  Please enter the 6-digits code we have sent to:{" "}
  <span className="font-medium text-foreground">{email}</span>.{" "}
  <button
  type="button"
  onClick={onEditEmail}
  className="text-primary hover:underline font-medium text-xs ml-1 cursor-pointer"
  >
  Edit
  </button>
  </p>
  </div>

  <form onSubmit={handleSubmit} className="space-y-6">
  {/* OTP 6 Boxes */}
  <div className="flex items-center justify-between gap-2 sm:gap-3">
  {digits.map((digit, index) => (
  <input
  key={index}
  ref={(el) => {
  inputRefs.current[index] = el;
  }}
  type="text"
  inputMode="numeric"
  maxLength={1}
  value={digit}
  onChange={(e) => handleDigitChange(index, e.target.value)}
  onKeyDown={(e) => handleKeyDown(index, e)}
  onPaste={handlePaste}
  disabled={isVerifying}
  className="size-11 sm:size-12 text-center text-lg font-semibold border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all"
  />
  ))}
  </div>

  {/* Active 60s Countdown Timer / Resend Button */}
  <div className="text-center text-xs sm:text-sm text-muted-foreground min-h-[24px] flex items-center justify-center">
  {remainingSeconds > 0 ? (
  <span>
  You can request another code in:{" "}
  <span className="font-bold text-primary tabular-nums">
  {remainingSeconds}s
  </span>
  </span>
  ) : (
  <button
  type="button"
  onClick={handleResend}
  disabled={isResending}
  className="text-primary hover:underline font-semibold cursor-pointer"
  >
  {isResending ? "Sending code..." : "Request another code"}
  </button>
  )}
  </div>

  <Button
  type="submit"
  className="w-full bg-accent/60 hover:bg-accent border border-primary/20 text-primary font-medium py-2.5 text-sm transition-colors cursor-pointer"
  disabled={!isComplete || isVerifying}
  >
  {isVerifying ? "Verifying..." : "Verify Code"}
  </Button>
  </form>
  </div>
  );
}

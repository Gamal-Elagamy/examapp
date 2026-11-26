"use client";

import { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from "react";
import { X, ChevronRight, Loader2 } from "lucide-react";
import {
  getClientRequestChangeEmail,
  getClientConfirmChangeEmail,
} from "../lib/apis/account.api";
import type { IUser } from "@/shared/lib/types/user";

interface ChangeEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: IUser) => void;
  currentEmail?: string;
}

export function ChangeEmailDialog({
  isOpen,
  onClose,
  onSuccess,
}: ChangeEmailDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [newEmail, setNewEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 60-second OTP countdown timer
  const [timeLeft, setTimeLeft] = useState(60);

  // Handle countdown interval during Step 2
  useEffect(() => {
  if (!isOpen || step !== 2) return;

  const interval = setInterval(() => {
  setTimeLeft((prev) => {
  if (prev <= 1) {
  clearInterval(interval);
  return 0;
  }
  return prev - 1;
  });
  }, 1000);

  return () => clearInterval(interval);
  }, [isOpen, step]);

  // Auto-focus first OTP digit when switching to Step 2
  useEffect(() => {
  if (step === 2) {
  inputRefs.current[0]?.focus();
  }
  }, [step]);

  // Handle ESC key to close
  useEffect(() => {
  function handleKeyDown(e: globalThis.KeyboardEvent) {
  if (e.key === "Escape" && isOpen) {
  onClose();
  }
  }
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Step 1: Request Email Change
  const handleRequestEmail = async (e: React.FormEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (!newEmail || !newEmail.includes("@")) {
  setErrorMessage("Please enter a valid email address.");
  return;
  }

  setIsSubmittingEmail(true);
  setErrorMessage(null);

  try {
  await getClientRequestChangeEmail(newEmail.trim());
  setStep(2);
  setTimeLeft(60);
  setDigits(["", "", "", "", "", ""]);
  } catch (err) {
  const msg = err instanceof Error ? err.message : "Failed to send verification code";
  setErrorMessage(msg);
  } finally {
  setIsSubmittingEmail(false);
  }
  };

  // Step 2: Handle OTP input changes
  const handleDigitChange = (index: number, val: string) => {
  const char = val.replace(/\D/g, "").slice(-1);
  const nextDigits = [...digits];
  nextDigits[index] = char;
  setDigits(nextDigits);

  if (char && index < 5) {
  inputRefs.current[index + 1]?.focus();
  }
  };

  const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Backspace" && !digits[index] && index > 0) {
  inputRefs.current[index - 1]?.focus();
  }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").trim();
  if (!pasteData) return;

  const chars = pasteData.slice(0, 6).split("");
  const nextDigits = [...digits];
  chars.forEach((c, i) => {
  if (i < 6) nextDigits[i] = c;
  });
  setDigits(nextDigits);

  const focusIdx = Math.min(chars.length, 5);
  inputRefs.current[focusIdx]?.focus();
  };

  // Step 2: Resend Code
  const handleResendCode = async () => {
  if (isResending || timeLeft > 0) return;
  setIsResending(true);
  setErrorMessage(null);

  try {
  await getClientRequestChangeEmail(newEmail.trim());
  setTimeLeft(60);
  setDigits(["", "", "", "", "", ""]);
  inputRefs.current[0]?.focus();
  } catch (err) {
  const msg = err instanceof Error ? err.message : "Failed to resend code";
  setErrorMessage(msg);
  } finally {
  setIsResending(false);
  }
  };

  // Step 2: Verify OTP and Confirm Email Change
  const handleVerifyOtp = async () => {
  const code = digits.join("");
  if (code.length !== 6) {
  setErrorMessage("Please enter all 6 digits of the code.");
  return;
  }

  setIsVerifyingOtp(true);
  setErrorMessage(null);

  try {
  const res = await getClientConfirmChangeEmail(code);
  const updatedUser =
  res.user || (res as unknown as { payload?: { user?: IUser } })?.payload?.user;
  if (updatedUser) {
  onSuccess(updatedUser);
  }
  onClose();
  } catch (err) {
  const msg = err instanceof Error ? err.message : "Invalid verification code";
  setErrorMessage(msg);
  } finally {
  setIsVerifyingOtp(false);
  }
  };

  const fullCode = digits.join("");

  return (
  <div
  role="dialog"
  aria-modal="true"
  aria-labelledby="change-email-title"
  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
  >
  <div className="bg-white max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/60">
  {/* Close Button */}
  <button
  type="button"
  onClick={onClose}
  aria-label="Close dialog"
  className="absolute top-5 inset-e-5 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer hover:bg-slate-100"
  >
  <X className="size-4.5" />
  </button>

  {/* Stepper with Diamond Indicators */}
  <div className="flex items-center justify-between relative mb-6 px-1">
  {/* Connecting Track Line */}
  <div
  className={`absolute inset-x-3 top-1/2 -translate-y-1/2 border-t-2 ${
  step === 2
  ? "border-primary"
  : "border-dashed border-primary/40"
  }`}
  />
  {/* Left Diamond (Step 1) */}
  <div className="relative z-10 size-3 rotate-45 bg-primary border-2 border-primary" />
  {/* Right Diamond (Step 2) */}
  <div
  className={`relative z-10 size-3 rotate-45 border-2 border-primary transition-colors ${
  step === 2 ? "bg-primary" : "bg-white"
  }`}
  />
  </div>

  {/* Dialog Header */}
  <div className="space-y-1 pb-4">
  <h2 id="change-email-title" className="text-xl sm:text-2xl font-bold text-foreground font-sans tracking-tight">
  Change Email
  </h2>
  <h3 className="text-sm sm:text-base font-bold text-primary font-sans">
  {step === 1 ? "Enter your new email" : "Verify OTP"}
  </h3>
  </div>

  {/* Error Alert */}
  {errorMessage && (
  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
  {errorMessage}
  </div>
  )}

  {/* Step 1: Enter New Email Form */}
  {step === 1 && (
  <form onSubmit={handleRequestEmail} className="space-y-6">
  <div className="space-y-1.5">
  <label htmlFor="newEmailInput" className="block text-xs font-mono text-muted-foreground select-none">
  Email
  </label>
  <input
  id="newEmailInput"
  type="email"
  required
  autoFocus
  value={newEmail}
  onChange={(e) => setNewEmail(e.target.value)}
  placeholder="user@example.com"
  className="w-full px-4 py-2.5 border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
  />
  </div>

  <button
  type="submit"
  disabled={isSubmittingEmail || !newEmail}
  className="w-full py-3 px-6 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer select-none"
  >
  {isSubmittingEmail && <Loader2 className="size-4 animate-spin" />}
  <span>Next</span>
  {!isSubmittingEmail && <ChevronRight className="size-4" />}
  </button>
  </form>
  )}

  {/* Step 2: Verify OTP Form */}
  {step === 2 && (
  <div className="space-y-6">
  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
  Please enter the 6-digits code we have sent to:
  <br />
  <span className="text-foreground font-semibold">{newEmail}.</span>
  <button
  type="button"
  onClick={() => {
  setStep(1);
  setErrorMessage(null);
  }}
  className="text-primary hover:underline font-semibold cursor-pointer ms-1.5"
  >
  Edit
  </button>
  </p>

  {/* 6 OTP Input Boxes */}
  <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 md:gap-3 py-1">
  {digits.map((digit, idx) => (
  <input
  key={idx}
  ref={(el) => {
  inputRefs.current[idx] = el;
  }}
  type="text"
  inputMode="numeric"
  maxLength={1}
  value={digit}
  onChange={(e) => handleDigitChange(idx, e.target.value)}
  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
  onPaste={handlePaste}
  className={`size-9 sm:size-11 md:size-12 text-center text-base sm:text-lg md:text-xl font-bold font-mono border transition-all focus:outline-hidden ${
  digit
  ? "border-primary text-foreground bg-primary/5"
  : "border-border text-foreground bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
  }`}
  />
  ))}
  </div>

  {/* Resend Timer or Button */}
  <div className="text-center">
  {timeLeft > 0 ? (
  <p className="text-xs text-muted-foreground font-mono">
  You can request another code in:{" "}
  <span className="text-foreground font-semibold">{timeLeft}s</span>
  </p>
  ) : (
  <button
  type="button"
  onClick={handleResendCode}
  disabled={isResending}
  className="text-xs text-primary font-mono font-semibold hover:underline cursor-pointer disabled:opacity-50"
  >
  {isResending ? "Resending..." : "Didn't get a code? Resend Code"}
  </button>
  )}
  </div>

  {/* Verify Code Button */}
  <button
  type="button"
  onClick={handleVerifyOtp}
  disabled={isVerifyingOtp || fullCode.length !== 6}
  className="w-full py-3 px-6 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
  >
  {isVerifyingOtp && <Loader2 className="size-4 animate-spin" />}
  <span>Verify Code</span>
  </button>
  </div>
  )}
  </div>
  </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "elevate_otp_resend_target";

function getInitialRemaining(defaultDuration: number): number {
  if (typeof window === "undefined") return defaultDuration;

  const storedTarget = localStorage.getItem(STORAGE_KEY);
  if (!storedTarget) {
    const target = Date.now() + defaultDuration * 1000;
    localStorage.setItem(STORAGE_KEY, target.toString());
    return defaultDuration;
  }

  const targetTime = parseInt(storedTarget, 10);
  const diff = Math.ceil((targetTime - Date.now()) / 1000);

  return diff > 0 ? diff : 0;
}

export function useOtpTimer(defaultDuration = 60) {
  // Lazy state initialization runs before render, avoiding setState inside useEffect
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    getInitialRemaining(defaultDuration),
  );

  const startTimer = useCallback(
    (seconds = defaultDuration) => {
      if (typeof window === "undefined") return;
      const target = Date.now() + seconds * 1000;
      localStorage.setItem(STORAGE_KEY, target.toString());
      setRemainingSeconds(seconds);
    },
    [defaultDuration],
  );

  const resetTimer = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    setRemainingSeconds(0);
  }, []);

  useEffect(() => {
    // Only subscribe to the interval callback; no synchronous setState in effect body
    const interval = setInterval(() => {
      const storedTarget = localStorage.getItem(STORAGE_KEY);
      if (!storedTarget) {
        setRemainingSeconds(0);
        return;
      }

      const targetTime = parseInt(storedTarget, 10);
      const diff = Math.ceil((targetTime - Date.now()) / 1000);
      const remaining = diff > 0 ? diff : 0;

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    remainingSeconds,
    canResend: remainingSeconds <= 0,
    startTimer,
    resetTimer,
  };
}

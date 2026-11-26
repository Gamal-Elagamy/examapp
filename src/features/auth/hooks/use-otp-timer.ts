"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "elevate_otp_resend_target";

export function useOtpTimer(defaultDuration = 60) {
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = parseInt(stored, 10);
    return parsed > Date.now() ? parsed : null;
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    const diff = Math.ceil((parseInt(stored, 10) - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  });

  const startTimer = useCallback(
    (seconds = defaultDuration) => {
      if (typeof window === "undefined") return;
      const target = Date.now() + seconds * 1000;
      localStorage.setItem(STORAGE_KEY, target.toString());
      setTargetTimestamp(target);
      setRemainingSeconds(seconds);
    },
    [defaultDuration],
  );

  const resetTimer = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    setTargetTimestamp(null);
    setRemainingSeconds(0);
  }, []);

  useEffect(() => {
    if (!targetTimestamp) return;

    const updateRemaining = () => {
      const diff = Math.ceil((targetTimestamp - Date.now()) / 1000);
      if (diff <= 0) {
        setRemainingSeconds(0);
        setTargetTimestamp(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        setRemainingSeconds(diff);
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return {
    remainingSeconds,
    canResend: remainingSeconds <= 0,
    startTimer,
    resetTimer,
  };
}

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface UseExamTimerOptions {
  examId: string;
  totalDurationMinutes?: number;
  onTimeUp?: () => void;
}

export function useExamTimer({
  examId,
  totalDurationMinutes = 20,
  onTimeUp,
}: UseExamTimerOptions) {
  const totalSeconds = useMemo(
    () => Math.max(1, totalDurationMinutes * 60),
    [totalDurationMinutes],
  );

  const storageKey = `exam_timer_${examId}`;

  // Read or initialize target end time in sessionStorage so refresh doesn't reset the countdown
  const getInitialRemaining = useCallback((): number => {
    if (typeof window === "undefined") return totalSeconds;

    const storedEndTime = sessionStorage.getItem(storageKey);
    const now = Date.now();

    if (storedEndTime) {
      const parsedEndTime = parseInt(storedEndTime, 10);
      const remaining = Math.round((parsedEndTime - now) / 1000);
      if (remaining > 0) {
        return Math.min(remaining, totalSeconds);
      }
      return 0;
    }

    const newEndTime = now + totalSeconds * 1000;
    sessionStorage.setItem(storageKey, newEndTime.toString());
    return totalSeconds;
  }, [storageKey, totalSeconds]);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(getInitialRemaining);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp, remainingSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Percentage from 0 to 100 (for circular SVG progress ring)
  const progressPercentage = Math.max(
    0,
    Math.min(100, (remainingSeconds / totalSeconds) * 100),
  );

  const resetTimer = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(storageKey);
    }
    setRemainingSeconds(totalSeconds);
  }, [storageKey, totalSeconds]);

  return {
    remainingSeconds,
    formattedTime,
    progressPercentage,
    isTimeUp: remainingSeconds === 0,
    resetTimer,
  };
}

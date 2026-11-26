"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

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
    () => Math.max(1, Math.round(totalDurationMinutes * 60)),
    [totalDurationMinutes],
  );

  const storageKey = `exam_timer_${examId}`;
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);
  const hasCalledTimeUpRef = useRef(false);

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
    if (typeof window === "undefined") return;

    const tick = () => {
      const storedEndTime = sessionStorage.getItem(storageKey);
      if (!storedEndTime) return;

      const now = Date.now();
      const parsedEndTime = parseInt(storedEndTime, 10);
      const remaining = Math.max(0, Math.round((parsedEndTime - now) / 1000));

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (!hasCalledTimeUpRef.current) {
          hasCalledTimeUpRef.current = true;
          onTimeUpRef.current?.();
        }
      }
    };

    // Initial check on mount
    const storedEndTime = sessionStorage.getItem(storageKey);
    if (storedEndTime) {
      const parsedEndTime = parseInt(storedEndTime, 10);
      if (parsedEndTime <= Date.now()) {
        if (!hasCalledTimeUpRef.current) {
          hasCalledTimeUpRef.current = true;
          onTimeUpRef.current?.();
        }
        return;
      }
    }

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [storageKey]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Percentage from 0 to 100 (for circular SVG progress ring)
  const progressPercentage = Math.max(
    0,
    Math.min(100, (remainingSeconds / totalSeconds) * 100),
  );

  const resetTimer = useCallback(() => {
    hasCalledTimeUpRef.current = false;
    if (typeof window !== "undefined") {
      const now = Date.now();
      const newEndTime = now + totalSeconds * 1000;
      sessionStorage.setItem(storageKey, newEndTime.toString());
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

"use client";

import type { ISubmissionAnalytics } from "@/shared/lib/types/submission";

interface SubmissionAnalyticsListProps {
  analytics: ISubmissionAnalytics[];
}

export function SubmissionAnalyticsList({ analytics }: SubmissionAnalyticsListProps) {
  return (
    <div className="space-y-6 max-h-[460px] overflow-y-auto pe-2 sm:pe-4">
      {analytics.map((item, index) => {
        const hasSelected = !!item.selectedAnswer?.text;
        const isWrong = !item.isCorrect;

        return (
          <div key={item.questionId || index} className="space-y-3 pb-4 border-b border-border/40 last:border-b-0">
            {/* Question Text */}
            <h3 className="text-sm sm:text-base font-bold text-primary font-mono leading-snug">
              {item.questionText}
            </h3>

            {/* Answer Rows Stack */}
            <div className="space-y-2">
              {/* If wrong, display user's incorrect selected answer in RED box */}
              {isWrong && (
                <div className="w-full rounded-xl bg-red-50/80 border border-red-200/70 p-3 sm:p-3.5 flex items-center gap-3 text-xs sm:text-sm text-red-950">
                  <div className="size-4.5 rounded-full border-2 border-red-500 bg-white flex items-center justify-center shrink-0">
                    <div className="size-2 rounded-full bg-red-500" />
                  </div>
                  <span className="font-mono">
                    {hasSelected ? item.selectedAnswer?.text : "No answer selected"}
                  </span>
                </div>
              )}

              {/* Display the correct answer in GREEN box */}
              {item.correctAnswer?.text && (
                <div className="w-full rounded-xl bg-emerald-50/80 border border-emerald-200/70 p-3 sm:p-3.5 flex items-center gap-3 text-xs sm:text-sm text-emerald-950">
                  <div className="size-4.5 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center shrink-0" />
                  <span className="font-mono font-medium">
                    {item.correctAnswer.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

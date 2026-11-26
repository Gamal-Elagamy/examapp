"use client";

import { RotateCcw, Compass } from "lucide-react";
import { DonutChart } from "./donut-chart";
import { SubmissionAnalyticsList } from "./submission-analytics-list";
import type { ISubmissionDetailsPayload } from "@/shared/lib/types/submission";

interface SubmissionResultsViewProps {
  submissionData: ISubmissionDetailsPayload;
  onRestart: () => void;
  onExplore: () => void;
}

export function SubmissionResultsView({
  submissionData,
  onRestart,
  onExplore,
}: SubmissionResultsViewProps) {
  const { submission, analytics } = submissionData;

  const correctCount = submission.correctAnswers ?? 0;
  const incorrectCount = submission.wrongAnswers ?? 0;

  return (
  <div className="space-y-6">
  {/* Results Title */}
  <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight font-mono">
  Results:
  </h2>

  {/* Split Content: Left Donut Chart & Right Answers Analytics */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  {/* Left Column: Donut Chart & Legend */}
  <div
  style={{ backgroundColor: "rgba(239, 246, 255, 1)" }}
  className="lg:col-span-5 border border-brand-blue-200/50 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[360px]"
  >
  <DonutChart
  correctCount={correctCount}
  incorrectCount={incorrectCount}
  />
  </div>

  {/* Right Column: Answers Review List */}
  <div className="lg:col-span-7 border border-dashed border-border/80 bg-white p-5 sm:p-6 min-h-[360px]">
  <SubmissionAnalyticsList analytics={analytics || []} />
  </div>
  </div>

  {/* Bottom Actions Bar */}
  <div className="flex items-center gap-4 pt-4 border-t border-border/60">
  {/* Restart Button */}
  <button
  type="button"
  onClick={onRestart}
  className="py-3 px-8 bg-slate-100 hover:bg-slate-200 text-foreground font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors select-none"
  >
  <RotateCcw className="size-4 text-muted-foreground" />
  <span>Restart</span>
  </button>

  {/* Explore Button */}
  <button
  type="button"
  onClick={onExplore}
  className="flex-1 py-3 px-8 bg-primary hover:bg-primary-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
  >
  <Compass className="size-4" />
  <span>Explore</span>
  </button>
  </div>
  </div>
  );
}

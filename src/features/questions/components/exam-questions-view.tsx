"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, HelpCircle, AlertCircle } from "lucide-react";
import { ROUTES } from "@/routes";
import { useExamQuestions } from "../hooks/use-exam-questions";
import { useExamTimer } from "../hooks/use-exam-timer";
import { QuestionCard } from "./question-card";
import { ExamTimer } from "./exam-timer";
import type { IQuestion } from "@/shared/lib/types/question";

interface ExamQuestionsViewProps {
  examId: string;
  initialQuestions?: IQuestion[];
  examTitle?: string;
  diplomaTitle?: string;
  durationMinutes?: number;
}

export function ExamQuestionsView({
  examId,
  initialQuestions,
  examTitle: initialExamTitle,
  diplomaTitle: initialDiplomaTitle,
  durationMinutes = 20,
}: ExamQuestionsViewProps) {
  const router = useRouter();

  const { data: questions = [], isLoading, error } = useExamQuestions({
    examId,
    initialData: initialQuestions,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // Store user's selected answers: questionId -> answerId
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = sessionStorage.getItem(`exam_answers_${examId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Sync answers with sessionStorage
  const handleSelectAnswer = useCallback(
    (answerId: string) => {
      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) return;

      setSelectedAnswers((prev) => {
        const next = { ...prev, [currentQuestion.id]: answerId };
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`exam_answers_${examId}`, JSON.stringify(next));
        }
        return next;
      });
    },
    [currentIndex, examId, questions],
  );

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const examTitle = useMemo(() => {
    return (
      questions[0]?.exam?.title ||
      initialExamTitle ||
      "Exam"
    );
  }, [questions, initialExamTitle]);

  const diplomaTitle = initialDiplomaTitle || "Frontend Development";

  // Handle Time's Up
  const handleTimeUp = useCallback(() => {
    // Auto-handled or notice
  }, []);

  const { formattedTime, progressPercentage, isTimeUp } = useExamTimer({
    examId,
    totalDurationMinutes: durationMinutes,
    onTimeUp: handleTimeUp,
  });

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed exam
      alert("Exam submitted successfully!");
      router.push(ROUTES.HOME);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressBarWidth = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Link
          href={ROUTES.HOME}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Diplomas
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px] text-muted-foreground">
          {diplomaTitle}
        </span>
        <span>/</span>
        <span className="text-primary font-semibold truncate max-w-[200px]">
          {examTitle}
        </span>
      </nav>

      {/* Header Row: Back Button & Blue Banner */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="size-12 sm:size-14 rounded-lg border border-border/80 bg-white flex items-center justify-center text-primary hover:bg-brand-blue-50 hover:border-primary transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <ChevronLeft className="size-6 text-primary" />
        </button>

        <div className="flex-1 h-12 sm:h-14 bg-primary text-white rounded-lg px-4 sm:px-6 flex items-center gap-3 shadow-xs overflow-hidden">
          <HelpCircle className="size-6 shrink-0" />
          <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">
            {examTitle} Questions
          </h1>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0" />
          <span>Failed to load questions. Please check your connection and try again.</span>
        </div>
      )}

      {/* Main Question Card Area */}
      {!isLoading && currentQuestion && (
        <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-2xs space-y-8">
          {/* Top Progress & Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            {/* Left: Quiz Title & Progress Bar */}
            <div className="space-y-2 flex-1 max-w-md">
              <span className="text-xs sm:text-sm font-mono text-muted-foreground font-medium select-none">
                {diplomaTitle} - {examTitle} Quiz
              </span>
              {/* Progress Line */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressBarWidth}%` }}
                  className="h-full bg-primary rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Right: Question Counter & Countdown Timer */}
            <div className="flex items-center gap-5 self-end sm:self-auto shrink-0">
              <div className="text-xs sm:text-sm font-mono text-muted-foreground select-none">
                Question <span className="text-primary font-bold">{currentIndex + 1}</span> of {totalQuestions}
              </div>

              {/* Vertical Divider */}
              <div className="h-8 w-px bg-border/80 hidden sm:block" />

              {/* Circular Countdown Timer */}
              <ExamTimer
                formattedTime={formattedTime}
                progressPercentage={progressPercentage}
                isTimeUp={isTimeUp}
              />
            </div>
          </div>

          {/* Question & Answers Card */}
          <QuestionCard
            question={currentQuestion}
            selectedAnswerId={selectedAnswers[currentQuestion.id]}
            onSelectAnswer={handleSelectAnswer}
          />

          {/* Navigation Action Buttons Bar */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/60">
            {/* Previous Button */}
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className={`flex-1 sm:flex-initial sm:w-48 py-3 px-6 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors select-none ${
                isFirstQuestion
                  ? "bg-[#e5e7eb] text-gray-400 cursor-not-allowed"
                  : "bg-slate-100 hover:bg-slate-200 text-foreground cursor-pointer"
              }`}
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </button>

            {/* Next / Submit Button */}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-6 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer select-none"
            >
              <span>{isLastQuestion ? "Submit" : "Next"}</span>
              {!isLastQuestion && <ChevronRight className="size-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && questions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-white space-y-3">
          <div className="mx-auto size-12 rounded-full bg-accent flex items-center justify-center text-primary">
            <HelpCircle className="size-6" />
          </div>
          <h2 className="text-base font-semibold text-foreground">No questions found</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            This exam does not have any questions registered yet.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              ← Back to exams
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

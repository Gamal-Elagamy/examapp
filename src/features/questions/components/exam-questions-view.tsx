"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, HelpCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/routes";
import { useExamQuestions } from "../hooks/use-exam-questions";
import { useExamDetails } from "../hooks/use-exam-details";
import { useExamTimer } from "../hooks/use-exam-timer";
import { useCreateSubmission } from "@/features/submissions/hooks/use-create-submission";
import { SubmissionResultsView } from "@/features/submissions/components/submission-results-view";
import { QuestionCard } from "./question-card";
import { ExamTimer } from "./exam-timer";
import type { IQuestion } from "@/shared/lib/types/question";
import type { IExamDetails } from "@/shared/lib/types/exam";
import type { ISubmissionDetailsPayload } from "@/shared/lib/types/submission";

interface ExamQuestionsViewProps {
  examId: string;
  initialQuestions?: IQuestion[];
  initialExam?: IExamDetails;
}

export function ExamQuestionsView({
  examId,
  initialQuestions,
  initialExam,
}: ExamQuestionsViewProps) {
  const router = useRouter();

  // Submission result state (persisted in sessionStorage across refresh)
  const [submissionResult, setSubmissionResult] = useState<ISubmissionDetailsPayload | null>(() => {
  if (typeof window === "undefined") return null;
  try {
  const stored = sessionStorage.getItem(`exam_result_${examId}`);
  return stored ? JSON.parse(stored) : null;
  } catch {
  return null;
  }
  });

  // Exam start time timestamp
  const [startedAt, setStartedAt] = useState<string>(() => new Date().toISOString());

  // Fetch questions for this exam
  const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError } =
  useExamQuestions({
  examId,
  initialData: initialQuestions,
  });

  // Fetch exam metadata (duration, diploma details, questionsCount)
  const { data: examData, isLoading: isExamLoading } = useExamDetails({
  examId,
  initialData: initialExam,
  });

  const exam = examData || initialExam;
  const diploma = exam?.diploma;

  const examTitle = exam?.title || questions[0]?.exam?.title || "Exam";
  const diplomaTitle = diploma?.title || "Diploma";
  const diplomaLink = diploma?.id ? ROUTES.EXAMS.BY_DIPLOMA(diploma.id) : ROUTES.HOME;

  // Real duration in minutes from the exam endpoint (e.g. 50 or 20)
  const totalDurationMinutes = exam?.duration || 20;

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

  const totalQuestions = exam?.questionsCount || questions.length || 0;
  const currentQuestion = questions[currentIndex];

  // Submit Exam Mutation (MVC Controller)
  const { mutate: submitExam, isPending: isSubmitting } = useCreateSubmission({
  onSuccess: (data) => {
  setSubmissionResult(data);
  if (typeof window !== "undefined") {
  sessionStorage.setItem(`exam_result_${examId}`, JSON.stringify(data));
  sessionStorage.removeItem(`exam_answers_${examId}`);
  sessionStorage.removeItem(`exam_timer_${examId}`);
  }
  },
  onError: (error) => {
  toast.error(error.message || "Failed to submit exam");
  },
  });

  const handleSubmit = useCallback(
  (force = false) => {
  if (isSubmitting) return;

  const answeredCount = Object.keys(selectedAnswers).length;
  if (!force && totalQuestions > 0 && answeredCount < totalQuestions) {
  const unanswered = totalQuestions - answeredCount;
  const confirmSubmit = window.confirm(
  `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Are you sure you want to submit?`,
  );
  if (!confirmSubmit) return;
  }

  const formattedAnswers = Object.entries(selectedAnswers).map(
  ([questionId, answerId]) => ({ questionId, answerId }),
  );

  submitExam({
  examId,
  answers: formattedAnswers,
  startedAt,
  });
  },
  [examId, isSubmitting, selectedAnswers, startedAt, submitExam, totalQuestions],
  );

  // Handle Time's Up: automatically submits the exam without confirmation prompt
  const handleTimeUp = useCallback(() => {
  handleSubmit(true);
  }, [handleSubmit]);

  // Exam-level countdown timer
  const { formattedTime, progressPercentage, isTimeUp, resetTimer } = useExamTimer({
  examId,
  totalDurationMinutes,
  onTimeUp: handleTimeUp,
  });

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = totalQuestions > 0 ? currentIndex === totalQuestions - 1 : false;

  const handleNext = () => {
  if (!isLastQuestion) {
  setCurrentIndex((prev) => prev + 1);
  } else {
  handleSubmit(false);
  }
  };

  const handlePrevious = () => {
  if (!isFirstQuestion) {
  setCurrentIndex((prev) => prev - 1);
  }
  };

  const handleRestart = useCallback(() => {
  setSubmissionResult(null);
  setCurrentIndex(0);
  setSelectedAnswers({});
  setStartedAt(new Date().toISOString());
  resetTimer();
  if (typeof window !== "undefined") {
  sessionStorage.removeItem(`exam_answers_${examId}`);
  sessionStorage.removeItem(`exam_timer_${examId}`);
  sessionStorage.removeItem(`exam_result_${examId}`);
  }
  }, [examId, resetTimer]);

  const handleExplore = useCallback(() => {
  if (typeof window !== "undefined") {
  sessionStorage.removeItem(`exam_result_${examId}`);
  }
  router.push(ROUTES.HOME);
  }, [examId, router]);

  // Progress Bar calculation: 100% when submitted, otherwise increases with questions
  const answeredCount = Object.keys(selectedAnswers).length;
  const isCurrentAnswered = !!(currentQuestion && selectedAnswers[currentQuestion.id]);

  const progressBarWidth = useMemo(() => {
  if (submissionResult) return 100;
  if (totalQuestions === 0) return 0;
  const count = Math.max(
  answeredCount,
  currentIndex > 0 ? currentIndex : isCurrentAnswered ? 1 : 0,
  );
  return Math.min(100, Math.max(0, (count / totalQuestions) * 100));
  }, [submissionResult, totalQuestions, answeredCount, currentIndex, isCurrentAnswered]);

  const isLoading = isQuestionsLoading && isExamLoading && !initialQuestions?.length;

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
  <Link
  href={diplomaLink}
  className="hover:text-primary transition-colors cursor-pointer truncate max-w-50"
  >
  {diplomaTitle}
  </Link>
  <span>/</span>
  <span className="text-primary font-semibold truncate max-w-50">
  {examTitle}
  </span>
  </nav>

  {/* Header Row: Back Button & Blue Banner */}
  <div className="flex items-center gap-3">
  <button
  type="button"
  onClick={() => router.back()}
  aria-label="Back"
  className="size-12 sm:size-14 border border-border/80 bg-white flex items-center justify-center text-primary hover:bg-brand-blue-50 hover:border-primary transition-colors shadow-2xs shrink-0 cursor-pointer"
  >
  <ChevronLeft className="size-6 text-primary" />
  </button>

  <div className="flex-1 h-12 sm:h-14 bg-primary text-white px-4 sm:px-6 flex items-center gap-3 shadow-xs overflow-hidden">
  <HelpCircle className="size-6 shrink-0" />
  <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">
  {examTitle} Questions
  </h1>
  </div>
  </div>

  {/* Error Notice */}
  {questionsError && (
  <div className="border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-3">
  <AlertCircle className="size-5 shrink-0" />
  <span>Failed to load questions. Please check your connection and try again.</span>
  </div>
  )}

  {/* Main Container Area */}
  {!isLoading && (currentQuestion || submissionResult) && (
  <div className="border border-border/80 bg-white p-6 sm:p-8 shadow-2xs space-y-8">
  {/* Top Progress & Meta Bar */}
  <div className="flex items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-border/60">
  {/* Left: Info Row & Full-Width Progress Bar */}
  <div className="flex-1 space-y-3 min-w-0">
  {/* Line 1: Title on left, Question Counter on right */}
  <div className="flex items-center justify-between gap-2">
  <span className="text-xs sm:text-sm font-mono text-muted-foreground font-medium select-none truncate">
  {diplomaTitle} - {examTitle} Quiz
  </span>
  <div className="text-xs sm:text-sm font-mono text-muted-foreground select-none shrink-0">
  Question <span className="text-primary font-bold">
  {submissionResult ? totalQuestions : currentIndex + 1}
  </span> of {totalQuestions}
  </div>
  </div>

  {/* Line 2: Full-Width Horizontal Progress Bar */}
  <div className="h-2.5 w-full bg-[#e0edff] overflow-hidden">
  <div
  style={{ width: `${progressBarWidth}%` }}
  className="h-full bg-primary transition-all duration-500 ease-out"
  />
  </div>
  </div>

  {/* Vertical Divider & Timer (hidden once submitted) */}
  {!submissionResult && (
  <>
  <div className="h-10 w-px bg-border/80 hidden sm:block shrink-0" />
  <ExamTimer
  formattedTime={formattedTime}
  progressPercentage={progressPercentage}
  isTimeUp={isTimeUp}
  />
  </>
  )}
  </div>

  {/* If Submitted: Display Results View */}
  {submissionResult ? (
  <SubmissionResultsView
  submissionData={submissionResult}
  onRestart={handleRestart}
  onExplore={handleExplore}
  />
  ) : (
  <>
  {/* Question & Answers Card */}
  {currentQuestion && (
  <QuestionCard
  question={currentQuestion}
  selectedAnswerId={selectedAnswers[currentQuestion.id]}
  onSelectAnswer={handleSelectAnswer}
  />
  )}

  {/* Navigation Action Buttons Bar */}
  <div className="flex items-center gap-4 pt-4 border-t border-border/60">
  {/* Previous Button */}
  <button
  type="button"
  onClick={handlePrevious}
  disabled={isFirstQuestion || isSubmitting}
  className={`flex-1 sm:flex-initial sm:w-48 py-3 px-6 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors select-none ${
  isFirstQuestion || isSubmitting
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
  disabled={isSubmitting}
  className="flex-1 py-3 px-6 bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer select-none"
  >
  {isSubmitting ? (
  <>
  <Loader2 className="size-4 animate-spin" />
  <span>Submitting...</span>
  </>
  ) : (
  <>
  <span>{isLastQuestion ? "Submit" : "Next"}</span>
  {!isLastQuestion && <ChevronRight className="size-4" />}
  </>
  )}
  </button>
  </div>
  </>
  )}
  </div>
  )}

  {/* Empty State */}
  {!isLoading && questions.length === 0 && !submissionResult && (
  <div className="border border-dashed border-border p-12 text-center bg-white space-y-3">
  <div className="mx-auto size-12 bg-accent flex items-center justify-center text-primary">
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

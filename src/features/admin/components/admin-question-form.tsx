"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Save,
  Plus,
  Trash2,
  Check,
  CheckCheck,
  Layers,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/routes";
import { useCreateQuestion } from "@/features/questions/hooks/use-create-question";
import { useUpdateQuestion } from "@/features/questions/hooks/use-update-question";
import { useBulkCreateQuestions } from "@/features/questions/hooks/use-bulk-create-questions";
import type { IQuestion, IAnswer } from "@/shared/lib/types/question";

interface ExamOption {
  id: string;
  title: string;
}

interface QuestionAnswerItem {
  id?: string;
  text: string;
  isCorrect: boolean;
}

interface BulkQuestionItem {
  id: string;
  text: string;
  answers: QuestionAnswerItem[];
}

interface AdminQuestionFormProps {
  mode: "create" | "edit";
  initialExamId?: string;
  initialQuestion?: IQuestion;
  exams?: ExamOption[];
}

export function AdminQuestionForm({
  mode,
  initialExamId = "",
  initialQuestion,
  exams = [],
}: AdminQuestionFormProps) {
  const router = useRouter();
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const bulkCreateMutation = useBulkCreateQuestions();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    bulkCreateMutation.isPending;

  // Mode state: Single vs Bulk
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);

  // Form states
  const [selectedExamId, setSelectedExamId] = useState<string>(
    initialExamId || initialQuestion?.examId || "",
  );

  // Single Question Mode State
  const [singleHeadline, setSingleHeadline] = useState<string>(
    initialQuestion?.text || "",
  );
  const [singleAnswers, setSingleAnswers] = useState<QuestionAnswerItem[]>(
    initialQuestion?.answers && initialQuestion.answers.length > 0
      ? initialQuestion.answers.map((a: IAnswer) => ({
          id: a.id,
          text: a.text,
          isCorrect: Boolean(a.isCorrect),
        }))
      : [],
  );

  // Bulk Mode Questions List
  const [bulkQuestions, setBulkQuestions] = useState<BulkQuestionItem[]>([
    {
      id: "q-1",
      text: "",
      answers: [],
    },
  ]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Dynamic Add Row states (for the currently active question)
  const [isAddingAnswer, setIsAddingAnswer] = useState<boolean>(false);
  const [newAnswerText, setNewAnswerText] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Current active question getters & setters
  const currentHeadline = isBulkMode
    ? bulkQuestions[activeQuestionIndex]?.text || ""
    : singleHeadline;

  const currentAnswers = isBulkMode
    ? bulkQuestions[activeQuestionIndex]?.answers || []
    : singleAnswers;

  const setCurrentHeadline = (val: string) => {
    if (isBulkMode) {
      setBulkQuestions((prev) =>
        prev.map((q, idx) =>
          idx === activeQuestionIndex ? { ...q, text: val } : q,
        ),
      );
    } else {
      setSingleHeadline(val);
    }
  };

  const setCurrentAnswers = (
    updater: (prevAnswers: QuestionAnswerItem[]) => QuestionAnswerItem[],
  ) => {
    if (isBulkMode) {
      setBulkQuestions((prev) =>
        prev.map((q, idx) =>
          idx === activeQuestionIndex
            ? { ...q, answers: updater(q.answers) }
            : q,
        ),
      );
    } else {
      setSingleAnswers(updater);
    }
  };

  // Add Question Tab in Bulk Mode
  const handleAddQuestionTab = () => {
    const newIndex = bulkQuestions.length;
    setBulkQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        text: "",
        answers: [],
      },
    ]);
    setActiveQuestionIndex(newIndex);
    setIsAddingAnswer(false);
    setNewAnswerText("");
  };

  // Delete Question Tab in Bulk Mode
  const handleDeleteQuestionTab = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bulkQuestions.length <= 1) {
      toast.error("At least one question must remain in bulk mode");
      return;
    }

    setBulkQuestions((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    if (activeQuestionIndex >= indexToDelete && activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    }
    setIsAddingAnswer(false);
    setNewAnswerText("");
  };

  // Delete an Answer
  const handleDeleteAnswer = (indexToDelete: number) => {
    setCurrentAnswers((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      if (
        prev[indexToDelete]?.isCorrect &&
        updated.length > 0 &&
        !updated.some((a) => a.isCorrect)
      ) {
        updated[0].isCorrect = true;
      }
      return updated;
    });
  };

  // Mark an Answer as Correct (all others become false)
  const handleMarkCorrect = (targetIndex: number) => {
    setCurrentAnswers((prev) =>
      prev.map((ans, idx) => ({
        ...ans,
        isCorrect: idx === targetIndex,
      })),
    );
  };

  // Confirm Add Answer
  const handleConfirmAddAnswer = () => {
    const trimmed = newAnswerText.trim();
    if (!trimmed) {
      toast.error("Please enter answer body");
      return;
    }

    if (currentAnswers.length >= 4) {
      toast.error("Answers cannot be more than 4");
      return;
    }

    setCurrentAnswers((prev) => {
      const willBeCorrect = prev.length === 0 || !prev.some((a) => a.isCorrect);
      return [...prev, { text: trimmed, isCorrect: willBeCorrect }];
    });

    setNewAnswerText("");
    setIsAddingAnswer(false);
  };

  // Cancel Add Answer
  const handleCancelAddAnswer = () => {
    setNewAnswerText("");
    setIsAddingAnswer(false);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedExamId) {
      setValidationError("Exam is required");
      toast.error("Exam is required");
      return;
    }

    // BULK MODE SUBMISSION
    if (isBulkMode) {
      if (bulkQuestions.length === 0) {
        setValidationError("Please add at least one question");
        toast.error("Please add at least one question");
        return;
      }

      for (let i = 0; i < bulkQuestions.length; i++) {
        const q = bulkQuestions[i];
        if (!q.text.trim()) {
          setActiveQuestionIndex(i);
          setValidationError(`Question Q${i + 1}: Headline is required`);
          toast.error(`Question Q${i + 1}: Headline is required`);
          return;
        }

        if (q.answers.length < 1) {
          setActiveQuestionIndex(i);
          setValidationError(`Question Q${i + 1}: At least one answer is required`);
          toast.error(`Question Q${i + 1}: At least one answer is required`);
          return;
        }

        if (q.answers.length > 4) {
          setActiveQuestionIndex(i);
          setValidationError(`Question Q${i + 1}: Answers cannot be more than 4`);
          toast.error(`Question Q${i + 1}: Answers cannot be more than 4`);
          return;
        }

        if (!q.answers.some((a) => a.isCorrect)) {
          setActiveQuestionIndex(i);
          setValidationError(`Question Q${i + 1}: One correct answer must exist`);
          toast.error(`Question Q${i + 1}: One correct answer must exist`);
          return;
        }
      }

      const bulkPayload = {
        questions: bulkQuestions.map((q) => ({
          text: q.text.trim(),
          answers: q.answers.map((a) => ({
            text: a.text.trim(),
            isCorrect: a.isCorrect,
          })),
        })),
      };

      bulkCreateMutation.mutate(
        { examId: selectedExamId, data: bulkPayload },
        {
          onSuccess: () => {
            router.push(ROUTES.ADMIN.EXAM_DETAILS(selectedExamId));
          },
        },
      );
      return;
    }

    // SINGLE QUESTION MODE SUBMISSION
    if (!singleHeadline.trim()) {
      setValidationError("Question headline is required");
      toast.error("Question headline is required");
      return;
    }

    if (singleAnswers.length < 1) {
      setValidationError("At least one answer is required");
      toast.error("At least one answer is required");
      return;
    }

    if (singleAnswers.length > 4) {
      setValidationError("Answers cannot be more than 4");
      toast.error("Answers cannot be more than 4");
      return;
    }

    if (!singleAnswers.some((a) => a.isCorrect)) {
      setValidationError("One correct answer must exist.");
      toast.error("One correct answer must exist.");
      return;
    }

    const payloadData = {
      text: singleHeadline.trim(),
      answers: singleAnswers.map((a) => ({
        text: a.text.trim(),
        isCorrect: a.isCorrect,
      })),
    };

    if (mode === "create") {
      createMutation.mutate(
        { examId: selectedExamId, data: payloadData },
        {
          onSuccess: (newQ) => {
            router.push(ROUTES.ADMIN.QUESTION_DETAILS(selectedExamId, newQ.id));
          },
        },
      );
    } else if (mode === "edit" && initialQuestion) {
      updateMutation.mutate(
        { id: initialQuestion.id, data: payloadData },
        {
          onSuccess: () => {
            router.push(
              ROUTES.ADMIN.QUESTION_DETAILS(selectedExamId, initialQuestion.id),
            );
          },
        },
      );
    }
  };

  const selectedExamTitle =
    exams.find((e) => e.id === selectedExamId)?.title || "Select exam";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl pb-12">
      {/* Top Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-muted-foreground font-mono flex-wrap"
      >
        <Link
          href={ROUTES.ADMIN.EXAMS}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Exams
        </Link>
        <span>/</span>
        {mode === "create" ? (
          <span className="text-primary font-semibold">Create New Question</span>
        ) : (
          <>
            <Link
              href={ROUTES.ADMIN.EXAM_DETAILS(selectedExamId)}
              className="hover:text-primary transition-colors cursor-pointer truncate max-w-40"
            >
              {selectedExamTitle}
            </Link>
            <span>/</span>
            <Link
              href={ROUTES.ADMIN.QUESTION_DETAILS(
                selectedExamId,
                initialQuestion?.id || "",
              )}
              className="hover:text-primary transition-colors cursor-pointer truncate max-w-40"
            >
              {initialQuestion?.text}
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold">Edit</span>
          </>
        )}
      </nav>

      {/* Top Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Bulk Add Mode Toggle (Only enabled when creating questions) */}
        {mode === "create" ? (
          <button
            type="button"
            onClick={() => {
              setIsBulkMode(!isBulkMode);
              setIsAddingAnswer(false);
              setNewAnswerText("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-semibold shadow-2xs transition-colors cursor-pointer select-none ${
              isBulkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
                : "bg-slate-100 hover:bg-slate-200 border border-border/80 text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>Bulk Add Mode</span>
          </button>
        ) : (
          <div />
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-border/80 text-foreground font-mono text-xs font-medium shadow-2xs transition-colors cursor-pointer select-none disabled:opacity-50"
          >
            <X className="size-3.5" />
            <span>Cancel</span>
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold shadow-xs hover:shadow-sm transition-colors cursor-pointer select-none disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Card 1: Exam Info (or Question Information in Single Mode) */}
      <div className="rounded-2xl border border-border/80 bg-white shadow-xs overflow-hidden">
        {/* Blue Header */}
        <div className="bg-blue-600 px-6 py-3.5 text-white font-mono font-bold text-xs sm:text-sm tracking-wide">
          {isBulkMode ? "Exam Info" : "Question Information"}
        </div>

        <div className="p-6 space-y-5">
          {/* Exam Select */}
          <div className="space-y-1.5">
            <label
              htmlFor="exam-select"
              className="text-xs font-mono font-bold text-slate-700"
            >
              Exam
            </label>
            <div className="relative">
              <select
                id="exam-select"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={mode === "edit"}
                className="w-full appearance-none rounded-xl border border-border/80 bg-slate-50/60 px-4 py-2.5 text-xs sm:text-sm font-mono text-foreground focus:bg-white focus:border-primary focus:outline-hidden transition-colors cursor-pointer disabled:opacity-60"
              >
                <option value="" disabled>
                  Select exam
                </option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Question Headline (Shown here only in Single Mode) */}
          {!isBulkMode && (
            <div className="space-y-1.5">
              <label
                htmlFor="question-headline"
                className="text-xs font-mono font-bold text-slate-700"
              >
                Question Headline
              </label>
              <input
                id="question-headline"
                type="text"
                value={singleHeadline}
                onChange={(e) => setSingleHeadline(e.target.value)}
                placeholder="Enter question headline"
                className="w-full rounded-xl border border-border/80 bg-slate-50/60 px-4 py-2.5 text-xs sm:text-sm font-mono text-foreground focus:bg-white focus:border-primary focus:outline-hidden transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Questions (Bulk Mode) or Question Answers (Single Mode) */}
      <div className="rounded-2xl border border-border/80 bg-white shadow-xs overflow-hidden">
        {/* Blue Header */}
        <div className="bg-blue-600 px-6 py-3.5 text-white font-mono font-bold text-xs sm:text-sm tracking-wide">
          {isBulkMode ? "Questions" : "Question Answers"}
        </div>

        {/* Bulk Mode Question Tabs (Q1, Q2, Q3 ... +) */}
        {isBulkMode && (
          <div className="bg-slate-50/90 border-b border-border/80 flex items-center overflow-x-auto select-none scrollbar-thin">
            {bulkQuestions.map((q, idx) => {
              const isActive = idx === activeQuestionIndex;
              return (
                <div
                  key={q.id || idx}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setIsAddingAnswer(false);
                    setNewAnswerText("");
                  }}
                  className={`group relative flex items-center justify-center gap-1.5 px-6 py-2.5 text-xs font-mono font-bold border-r border-border/70 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-white text-blue-600 border-b-2 border-b-blue-600 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>Q{idx + 1}</span>

                  {/* Delete Tab Button (Only when more than 1 question tab) */}
                  {bulkQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteQuestionTab(idx, e)}
                      aria-label={`Delete Question ${idx + 1}`}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-0.5 rounded cursor-pointer"
                    >
                      <X className="size-3 stroke-2" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add Question Tab (+) Button */}
            <button
              type="button"
              onClick={handleAddQuestionTab}
              aria-label="Add question"
              className="px-4 py-2.5 text-slate-600 hover:text-primary hover:bg-slate-100 font-mono text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
            >
              <Plus className="size-4 stroke-2" />
            </button>
          </div>
        )}

        {/* Inside Bulk Mode: Question Headline for the active tab */}
        {isBulkMode && (
          <div className="p-6 border-b border-border/70 space-y-1.5">
            <label
              htmlFor={`bulk-headline-${activeQuestionIndex}`}
              className="text-xs font-mono font-bold text-slate-700"
            >
              Question Headline
            </label>
            <input
              id={`bulk-headline-${activeQuestionIndex}`}
              type="text"
              value={currentHeadline}
              onChange={(e) => setCurrentHeadline(e.target.value)}
              placeholder="Enter question headline"
              className="w-full rounded-xl border border-border/80 bg-slate-50/60 px-4 py-2.5 text-xs sm:text-sm font-mono text-foreground focus:bg-white focus:border-primary focus:outline-hidden transition-colors"
            />
          </div>
        )}

        {/* Subheader: Body & + Add Answer */}
        <div className="bg-slate-100/90 border-b border-border/80 px-6 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-slate-700 select-none">
          <span>Body</span>

          <button
            type="button"
            onClick={() => setIsAddingAnswer(true)}
            disabled={currentAnswers.length >= 4 || isAddingAnswer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="size-3.5" />
            <span>Add Answer</span>
          </button>
        </div>

        {/* Answers List */}
        <div className="divide-y divide-border/60">
          {currentAnswers.length === 0 && !isAddingAnswer ? (
            <div className="py-8 text-center text-muted-foreground font-mono text-xs">
              No answers added yet. Click &quot;+ Add Answer&quot; to add one.
            </div>
          ) : (
            currentAnswers.map((answer, index) => (
              <div
                key={answer.id || index}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                {/* Delete Answer Icon */}
                <button
                  type="button"
                  onClick={() => handleDeleteAnswer(index)}
                  aria-label="Delete answer"
                  className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="size-4" />
                </button>

                {/* Answer Text */}
                <span className="text-xs sm:text-sm text-foreground font-mono flex-1 leading-relaxed">
                  {answer.text}
                </span>

                {/* Mark Correct / Correct Answer */}
                <div className="shrink-0">
                  {answer.isCorrect ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-600 font-mono text-xs font-semibold select-none">
                      <CheckCheck className="size-4 stroke-2" />
                      <span>Correct Answer</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMarkCorrect(index)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-border/70 text-slate-700 font-mono text-xs font-medium transition-colors cursor-pointer select-none"
                    >
                      <Check className="size-3.5 text-slate-500" />
                      <span>Mark Correct</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Dynamic Add Row at the bottom */}
          {isAddingAnswer && (
            <div className="px-6 py-3.5 flex items-center gap-3 bg-slate-50/50 border-t border-border/80 animate-in fade-in-50 duration-150">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancelAddAnswer}
                aria-label="Cancel adding answer"
                className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-border/80 flex items-center justify-center text-slate-600 hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X className="size-3.5" />
              </button>

              {/* Answer Input */}
              <input
                type="text"
                autoFocus
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddAnswer();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    handleCancelAddAnswer();
                  }
                }}
                placeholder="Enter answer body"
                className="flex-1 rounded-xl border-2 border-emerald-400 bg-white px-4 py-2 text-xs sm:text-sm font-mono text-foreground focus:border-emerald-600 focus:outline-hidden transition-colors"
              />

              {/* Add Button */}
              <button
                type="button"
                onClick={handleConfirmAddAnswer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="size-3.5 stroke-2" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

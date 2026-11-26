"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Ban,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Loader2,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { getClientUpdateQuestion } from "@/features/questions/lib/apis/questions.api";
import { questionKeys } from "@/features/questions/lib/apis/questions.key";
import { DeleteQuestionDialog } from "./delete-question-dialog";
import type { IQuestion } from "@/shared/lib/types/question";
import type { IExamDetails } from "@/shared/lib/types/exam";

interface AdminQuestionViewProps {
  question: IQuestion;
  exam: IExamDetails;
}

export function AdminQuestionView({ question, exam }: AdminQuestionViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === USER_ROLES.SUPER_ADMIN;

  const [showImmutabilityTooltip, setShowImmutabilityTooltip] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTogglingImmutable, setIsTogglingImmutable] = useState(false);
  const [isImmutable, setIsImmutable] = useState(Boolean(question.immutable));

  const isActionRestricted = isImmutable && !isSuperAdmin;

  const handleToggleImmutable = async () => {
  if (!isSuperAdmin || isTogglingImmutable) return;
  setIsTogglingImmutable(true);
  try {
  const nextState = !isImmutable;
  await getClientUpdateQuestion(question.id, {
  text: question.text,
  answers: (question.answers || []).map((ans) => ({
  text: ans.text,
  isCorrect: Boolean(ans.isCorrect),
  })),
  immutable: nextState,
  });
  setIsImmutable(nextState);
  queryClient.invalidateQueries({
  queryKey: questionKeys.detail(question.id),
  });
  queryClient.invalidateQueries({
  queryKey: questionKeys.exam(exam.id),
  });
  toast.success(
  nextState ? "Question is now immutable" : "Question is now mutable",
  );
  } catch (err) {
  toast.error(
  err instanceof Error
  ? err.message
  : "Failed to toggle question immutability",
  );
  } finally {
  setIsTogglingImmutable(false);
  }
  };

  return (
  <div className="space-y-6 max-w-5xl">
  {/* Breadcrumb Navigation */}
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
  <Link
  href={ROUTES.ADMIN.EXAM_DETAILS(exam.id)}
  className="hover:text-primary transition-colors cursor-pointer truncate max-w-44"
  >
  {exam.title}
  </Link>
  <span>/</span>
  <Link
  href={ROUTES.ADMIN.EXAM_DETAILS(exam.id)}
  className="hover:text-primary transition-colors cursor-pointer"
  >
  Questions
  </Link>
  <span>/</span>
  <span className="text-primary font-semibold">Question Details</span>
  </nav>

  {/* Header Row: Title & Action Buttons */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
  Question Details
  </h1>

  <div className="flex items-center gap-3 select-none flex-wrap">
  {/* Immutability Button */}
  <div
  className="relative"
  onMouseEnter={() => setShowImmutabilityTooltip(true)}
  onMouseLeave={() => setShowImmutabilityTooltip(false)}
  >
  <button
  type="button"
  disabled={!isSuperAdmin || isTogglingImmutable}
  onClick={handleToggleImmutable}
  className={`flex items-center gap-1.5 px-3.5 py-2 border text-xs font-mono font-medium shadow-2xs transition-colors ${
  isImmutable
  ? "bg-slate-100 border-slate-300 text-slate-700"
  : "bg-slate-50 border-slate-200 text-slate-600"
  } ${
  !isSuperAdmin
  ? "opacity-60 cursor-not-allowed"
  : "hover:bg-slate-200 cursor-pointer"
  }`}
  >
  {isTogglingImmutable ? (
  <Loader2 className="size-3.5 animate-spin" />
  ) : (
  <Ban className="size-3.5" />
  )}
  <span>Immutable</span>
  </button>

  {!isSuperAdmin && showImmutabilityTooltip && (
  <div
  role="tooltip"
  className="absolute bottom-full inset-x-1/2 -translate-x-1/2 mb-2 w-56 bg-foreground text-background text-xs font-mono px-3 py-2 shadow-lg z-50 text-center leading-relaxed pointer-events-none"
  >
  Only super admins are allowed to toggle the immutability.
  <span className="absolute top-full inset-x-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
  </div>
  )}
  </div>

  {/* Edit Button */}
  {isActionRestricted ? (
  <button
  type="button"
  disabled
  title="Only super admins can edit an immutable question"
  className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-400 text-xs font-mono font-semibold shadow-xs cursor-not-allowed select-none"
  >
  <Pencil className="size-3.5" />
  <span>Edit</span>
  </button>
  ) : (
  <button
  type="button"
  onClick={() =>
  router.push(ROUTES.ADMIN.EDIT_QUESTION(exam.id, question.id))
  }
  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono font-semibold shadow-xs hover:shadow-sm transition-colors cursor-pointer select-none"
  >
  <Pencil className="size-3.5" />
  <span>Edit</span>
  </button>
  )}

  {/* Delete Button */}
  <button
  type="button"
  disabled={isActionRestricted}
  title={
  isActionRestricted
  ? "Only super admins can delete an immutable question"
  : undefined
  }
  onClick={() => !isActionRestricted && setIsDeleteDialogOpen(true)}
  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold shadow-xs hover:shadow-sm transition-colors ${
  isActionRestricted
  ? "bg-slate-200 text-slate-400 cursor-not-allowed select-none"
  : "bg-red-600 hover:bg-red-700 text-white cursor-pointer select-none"
  }`}
  >
  <Trash2 className="size-3.5" />
  <span>Delete</span>
  </button>
  </div>
  </div>

  {/* Details Card */}
  <div className="border border-border/70 bg-white shadow-xs overflow-hidden">
  {/* Headline */}
  <div className="px-6 py-5 border-b border-border/60">
  <p className="text-xs font-mono text-muted-foreground mb-1.5">Headline</p>
  <p className="text-sm font-mono text-foreground leading-relaxed">
  {question.text}
  </p>
  </div>

  {/* Exam */}
  <div className="px-6 py-5 border-b border-border/60">
  <p className="text-xs font-mono text-muted-foreground mb-1.5">Exam</p>
  <Link
  href={ROUTES.ADMIN.EXAM_DETAILS(exam.id)}
  className="inline-flex items-center gap-1.5 text-sm font-mono text-foreground hover:text-primary transition-colors"
  >
  {exam.title}
  <ExternalLink className="size-3.5 text-muted-foreground" />
  </Link>
  </div>

  {/* Answers List with marked correct answer */}
  <div className="px-6 py-5">
  <p className="text-xs font-mono text-muted-foreground mb-3">
  Answers ({question.answers?.length ?? 0})
  </p>
  {question.answers && question.answers.length > 0 ? (
  <div className="space-y-2.5">
  {question.answers.map((ans, idx) => {
  const isCorrect = Boolean(ans.isCorrect);
  return (
  <div
  key={ans.id || idx}
  className={`flex items-center justify-between p-3.5 border text-xs sm:text-sm font-mono transition-colors ${
  isCorrect
  ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
  : "bg-slate-50 border-border/80 text-foreground"
  }`}
  >
  <div className="flex items-center gap-3">
  <span
  className={`size-6 flex items-center justify-center text-xs font-bold shrink-0 ${
  isCorrect
  ? "bg-emerald-600 text-white"
  : "bg-slate-200 text-slate-700"
  }`}
  >
  {String.fromCharCode(65 + idx)}
  </span>
  <span>{ans.text}</span>
  </div>
  {isCorrect && (
  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs shrink-0">
  <Check className="size-4" />
  Correct Answer
  </span>
  )}
  </div>
  );
  })}
  </div>
  ) : (
  <p className="text-sm font-mono text-muted-foreground">
  No answers found for this question.
  </p>
  )}
  </div>
  </div>

  {/* Delete Question Confirmation Dialog */}
  <DeleteQuestionDialog
  isOpen={isDeleteDialogOpen}
  question={question}
  onClose={() => setIsDeleteDialogOpen(false)}
  onSuccess={() => {
  router.push(ROUTES.ADMIN.EXAM_DETAILS(exam.id));
  }}
  />
  </div>
  );
}

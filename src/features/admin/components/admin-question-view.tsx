"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Ban, Pencil, Trash2, ExternalLink } from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { DeleteQuestionDialog } from "./delete-question-dialog";
import type { IQuestion } from "@/shared/lib/types/question";
import type { IExamDetails } from "@/shared/lib/types/exam";

interface AdminQuestionViewProps {
  question: IQuestion;
  exam: IExamDetails;
}

export function AdminQuestionView({ question, exam }: AdminQuestionViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === USER_ROLES.SUPER_ADMIN;

  const [showImmutabilityTooltip, setShowImmutabilityTooltip] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
        <span className="text-primary font-semibold truncate max-w-72">
          {question.text}
        </span>
      </nav>

      {/* Header Row: Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
            {question.text}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono flex items-center gap-1.5">
            <span>Exam:</span>
            <Link
              href={ROUTES.ADMIN.EXAM_DETAILS(exam.id)}
              className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
            >
              {exam.title}
              <ExternalLink className="size-3" />
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-3 select-none flex-wrap">
          {/* Immutability Button */}
          <div
            className="relative"
            onMouseEnter={() => setShowImmutabilityTooltip(true)}
            onMouseLeave={() => setShowImmutabilityTooltip(false)}
          >
            <button
              type="button"
              disabled={!isSuperAdmin}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-mono font-medium shadow-2xs transition-colors ${
                question.immutable
                  ? "bg-slate-100 border-slate-300 text-slate-700"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              } ${
                !isSuperAdmin
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-slate-200 cursor-pointer"
              }`}
            >
              <Ban className="size-3.5" />
              <span>Immutable</span>
            </button>

            {!isSuperAdmin && showImmutabilityTooltip && (
              <div
                role="tooltip"
                className="absolute bottom-full inset-x-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-foreground text-background text-xs font-mono px-3 py-2 shadow-lg z-50 text-center leading-relaxed pointer-events-none"
              >
                Only super admins are allowed to toggle the immutability.
                <span className="absolute top-full inset-x-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() =>
              router.push(ROUTES.ADMIN.EDIT_QUESTION(exam.id, question.id))
            }
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono font-semibold shadow-xs hover:shadow-sm transition-colors cursor-pointer select-none"
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-semibold shadow-xs hover:shadow-sm transition-colors cursor-pointer select-none"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Details Card */}
      <div className="rounded-2xl border border-border/70 bg-white shadow-xs overflow-hidden">
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

        {/* Answers Count */}
        <div className="px-6 py-5">
          <p className="text-xs font-mono text-muted-foreground mb-1.5">Answers</p>
          <p className="text-sm font-mono text-foreground">
            {question.answers?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Delete Question Confirmation Dialog */}
      <DeleteQuestionDialog
        isOpen={isDeleteDialogOpen}
        question={question}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={() => router.push(ROUTES.ADMIN.EXAM_DETAILS(exam.id))}
      />
    </div>
  );
}

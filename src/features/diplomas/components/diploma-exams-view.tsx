"use client";

import Link from "next/link";
import { ChevronLeft, BookOpen, AlertCircle } from "lucide-react";
import { ROUTES } from "@/routes";
import { useDiplomaDetails } from "../hooks/use-diploma-details";
import { ExamCard } from "./exam-card";
import { ExamCardSkeleton } from "../skeletons/exam-card.skeleton";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface DiplomaExamsViewProps {
  diplomaId: string;
  initialDiploma?: IDiploma;
}

export function DiplomaExamsView({ diplomaId, initialDiploma }: DiplomaExamsViewProps) {
  const { data: diploma, isLoading, error } = useDiplomaDetails({
    id: diplomaId,
    initialData: initialDiploma,
  });

  const title = diploma?.title || initialDiploma?.title || "Diploma";
  const exams = diploma?.exams || initialDiploma?.exams || [];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Link
          href={ROUTES.HOME}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Diplomas
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px] text-foreground font-medium">{title}</span>
        <span>/</span>
        <span className="text-primary font-semibold">Exams</span>
      </nav>

      {/* Header Row: Back Button & Blue Banner */}
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.HOME}
          aria-label="Back to diplomas"
          className="size-12 sm:size-14 rounded-lg border border-border/80 bg-white flex items-center justify-center text-primary hover:bg-brand-blue-50 hover:border-primary transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <ChevronLeft className="size-6 text-primary" />
        </Link>

        <div className="flex-1 h-12 sm:h-14 bg-primary text-white rounded-lg px-4 sm:px-6 flex items-center gap-3 shadow-xs overflow-hidden">
          <BookOpen className="size-6 shrink-0" />
          <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">
            {title} Exams
          </h1>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0" />
          <span>Failed to load exams. Please try refreshing the page.</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && !diploma && (
        <div className="space-y-4 pt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <ExamCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Exams List */}
      {!isLoading && exams.length > 0 && (
        <div className="space-y-4 pt-2">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}

          {/* End of List Centered Marker */}
          <div className="text-center pt-8 pb-4 text-xs font-mono text-muted-foreground select-none">
            End of list
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && exams.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-white space-y-3">
          <div className="mx-auto size-12 rounded-full bg-accent flex items-center justify-center text-primary">
            <BookOpen className="size-6" />
          </div>
          <h2 className="text-base font-semibold text-foreground">No exams available yet</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            There are currently no active exams for this diploma. Please check back later or explore other diplomas.
          </p>
          <div className="pt-2">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Browse other diplomas →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { ROUTES } from "@/routes";
import { useDiplomaDetails } from "../hooks/use-diploma-details";
import { useInfiniteDiplomaExams } from "../hooks/use-infinite-diploma-exams";
import { ExamCard } from "./exam-card";
import { ExamCardSkeleton } from "../skeletons/exam-card.skeleton";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface DiplomaExamsViewProps {
  diplomaId: string;
  initialDiploma?: IDiploma;
}

export function DiplomaExamsView({ diplomaId, initialDiploma }: DiplomaExamsViewProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: diploma, isLoading: isDiplomaLoading, error: diplomaError } = useDiplomaDetails({
  id: diplomaId,
  initialData: initialDiploma,
  });

  const {
  data: examsData,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading: isExamsLoading,
  error: examsError,
  } = useInfiniteDiplomaExams({ diplomaId, limit: 10 });

  const title = diploma?.title || initialDiploma?.title || "Diploma";

  // Flatten all pages or fallback to diploma.exams if query hasn't returned yet
  const paginatedExams = examsData?.pages.flatMap((page) => page.data) || [];
  const exams = paginatedExams.length > 0 ? paginatedExams : diploma?.exams || initialDiploma?.exams || [];

  const isLoading = (isDiplomaLoading || isExamsLoading) && exams.length === 0;
  const error = diplomaError || examsError;

  // IntersectionObserver for infinite scrolling
  useEffect(() => {
  const target = loadMoreRef.current;
  if (!target) return;

  const observer = new IntersectionObserver(
  (entries) => {
  if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  fetchNextPage();
  }
  },
  { rootMargin: "200px" },
  );

  observer.observe(target);
  return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
  <span className="truncate max-w-50 text-foreground font-medium">{title}</span>
  <span>/</span>
  <span className="text-primary font-semibold">Exams</span>
  </nav>

  {/* Header Row: Back Button & Blue Banner */}
  <div className="flex items-center gap-3">
  <Link
  href={ROUTES.HOME}
  aria-label="Back to diplomas"
  className="size-12 sm:size-14 border border-border/80 bg-white flex items-center justify-center text-primary hover:bg-brand-blue-50 hover:border-primary transition-colors shadow-2xs shrink-0 cursor-pointer"
  >
  <ChevronLeft className="size-6 text-primary" />
  </Link>

  <div className="flex-1 h-12 sm:h-14 bg-primary text-white px-4 sm:px-6 flex items-center gap-3 shadow-xs overflow-hidden">
  <BookOpen className="size-6 shrink-0" />
  <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">
  {title} Exams
  </h1>
  </div>
  </div>

  {/* Error State */}
  {error && exams.length === 0 && (
  <div className="border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-3">
  <AlertCircle className="size-5 shrink-0" />
  <span>Failed to load exams. Please try refreshing the page.</span>
  </div>
  )}

  {/* Loading Skeletons */}
  {isLoading && (
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

  {/* Infinite Scroll Sentinel & Indicator */}
  <div ref={loadMoreRef} className="py-4 flex flex-col items-center justify-center">
  {isFetchingNextPage && (
  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
  <Loader2 className="size-4 animate-spin text-primary" />
  <span>Loading more exams...</span>
  </div>
  )}

  {!hasNextPage && exams.length > 0 && (
  <div className="text-center pt-4 pb-2 text-xs font-mono text-muted-foreground select-none">
  End of list
  </div>
  )}
  </div>
  </div>
  )}

  {/* Empty State */}
  {!isLoading && exams.length === 0 && (
  <div className="border border-dashed border-border p-12 text-center bg-white space-y-3">
  <div className="mx-auto size-12 bg-accent flex items-center justify-center text-primary">
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

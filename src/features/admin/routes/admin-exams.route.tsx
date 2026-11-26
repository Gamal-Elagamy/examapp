"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { ROUTES } from "@/routes";
import { getClientExams } from "@/features/exams/lib/apis/exams.api";
import { examKeys } from "@/features/exams/lib/apis/exams.key";
import { AdminExamsFilter } from "../components/admin-exams-filter";
import {
  AdminExamsTable,
  type ExamSortOption,
} from "../components/admin-exams-table";
import { AdminExamsTableSkeleton } from "../skeletons/admin-exams-table.skeleton";
import { DeleteExamDialog } from "../components/delete-exam-dialog";
import type { IExamsPayload, IExam } from "@/shared/lib/types/exam";

interface AdminExamsRouteProps {
  initialData?: IExamsPayload;
}

export function AdminExamsRoute({ initialData }: AdminExamsRouteProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 12;
  const [search, setSearch] = useState("");
  const [diploma, setDiploma] = useState<string | undefined>(undefined);
  const [immutable, setImmutable] = useState<boolean | undefined>(undefined);
  const [sortOption, setSortOption] = useState<ExamSortOption>("title_asc");

  // Delete modal state
  const [examToDelete, setExamToDelete] = useState<IExam | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Derive sortBy & sortOrder from sortOption
  const getSortParams = (opt: ExamSortOption) => {
  switch (opt) {
  case "title_desc":
  return { sortBy: "title", sortOrder: "desc" as const };
  case "title_asc":
  return { sortBy: "title", sortOrder: "asc" as const };
  case "questions_desc":
  return { sortBy: "numberOfQuestions", sortOrder: "desc" as const };
  case "questions_asc":
  return { sortBy: "numberOfQuestions", sortOrder: "asc" as const };
  case "newest_desc":
  return { sortBy: "createdAt", sortOrder: "desc" as const };
  case "newest_asc":
  return { sortBy: "createdAt", sortOrder: "asc" as const };
  }
  };

  const { sortBy, sortOrder } = getSortParams(sortOption);

  const {
  data,
  isLoading,
  isPlaceholderData,
  } = useQuery({
  queryKey: examKeys.adminList({
  page,
  limit,
  search: search.trim() || undefined,
  diplomaId: diploma,
  immutable,
  sortBy,
  sortOrder,
  }),
  queryFn: () =>
  getClientExams({
  page,
  limit,
  search: search.trim() || undefined,
  diplomaId: diploma,
  immutable,
  sortBy,
  sortOrder,
  }),
  initialData:
  page === 1 && !search && !diploma && immutable === undefined && sortOption === "title_asc"
  ? initialData
  : undefined,
  initialDataUpdatedAt: 0,
  placeholderData: (prev) => prev,
  });

  const exams = data?.data || [];
  const metadata = data?.metadata || {
  page: 1,
  limit: 12,
  total: exams.length,
  totalPages: 1,
  };

  const total = metadata.total;
  const totalPages = Math.max(1, metadata.totalPages);
  const startItem = total > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, total);

  const handleFilterApply = (
  newSearch: string,
  newDiploma: string | undefined,
  newImmutable: boolean | undefined,
  ) => {
  setSearch(newSearch);
  setDiploma(newDiploma);
  setImmutable(newImmutable);
  setPage(1);
  };

  const handleFilterClear = () => {
  setSearch("");
  setDiploma(undefined);
  setImmutable(undefined);
  setPage(1);
  };

  const handleCreateNewExam = () => {
  router.push(ROUTES.ADMIN.CREATE_EXAM);
  };

  const handleView = (exam: IExam) => {
  router.push(ROUTES.ADMIN.EXAM_DETAILS(exam.id));
  };

  const handleEdit = (exam: IExam) => {
  router.push(ROUTES.ADMIN.EDIT_EXAM(exam.id));
  };

  const handleDelete = (exam: IExam) => {
  setExamToDelete(exam);
  setIsDeleteDialogOpen(true);
  };

  const handleAddQuestions = (exam: IExam) => {
  router.push(ROUTES.ADMIN.CREATE_QUESTION(exam.id));
  };

  return (
  <div className="space-y-6">
  {/* Top Breadcrumb */}
  <div className="text-xs text-muted-foreground font-mono select-none">
  Exams
  </div>

  {/* Top Action Row: Fixed on Scroll with Exact Joined Controls */}
  <div className="sticky top-15 lg:top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-xs py-3 -mt-3 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
  {/* Left: Record Range & Joined Pagination Control */}
  <div className="flex items-center gap-3 sm:gap-4 select-none">
  <span className="text-xs sm:text-sm font-mono text-muted-foreground">
  {startItem} - {endItem} of {total}
  </span>

  {/* Joined Segmented Pagination Controls matching screenshot */}
  <div className="inline-flex items-center border border-border/70 bg-white shadow-2xs overflow-hidden">
  <button
  type="button"
  onClick={() => setPage((p) => Math.max(1, p - 1))}
  disabled={page <= 1 || isPlaceholderData}
  aria-label="Previous page"
  className="size-8 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 border-e border-border/70 transition-colors cursor-pointer"
  >
  <ChevronLeft className="size-4" />
  </button>

  <div className="px-3 py-1 text-xs font-mono text-muted-foreground bg-white whitespace-nowrap">
  Page {page} of {totalPages}
  </div>

  <button
  type="button"
  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
  disabled={page >= totalPages || isPlaceholderData}
  aria-label="Next page"
  className="size-8 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 border-s border-border/70 transition-colors cursor-pointer"
  >
  <ChevronRight className="size-4" />
  </button>
  </div>
  </div>

  {/* Right: + Create New Exam Green Button (matching screenshot) */}
  <button
  type="button"
  onClick={handleCreateNewExam}
  className="w-full sm:w-auto px-4 py-2 bg-[#00B074] hover:bg-[#009663] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
  >
  <Plus className="size-4" />
  <span>Create New Exam</span>
  </button>
  </div>

  {/* Search & Filters Accordion */}
  <AdminExamsFilter
  initialSearch={search}
  initialDiploma={diploma}
  initialImmutable={immutable}
  onApply={handleFilterApply}
  onClear={handleFilterClear}
  />

  {/* Exams Table */}
  {isLoading && !exams.length ? (
  <AdminExamsTableSkeleton />
  ) : (
  <div className="relative">
  {isPlaceholderData && (
  <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center">
  <Loader2 className="size-6 animate-spin text-primary" />
  </div>
  )}
  <AdminExamsTable
  exams={exams}
  currentSort={sortOption}
  onSortChange={(opt) => {
  setSortOption(opt);
  setPage(1);
  }}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onAddQuestions={handleAddQuestions}
  />
  </div>
  )}

  {/* Delete Exam Confirmation Dialog */}
  <DeleteExamDialog
  isOpen={isDeleteDialogOpen}
  exam={examToDelete}
  onClose={() => {
  setIsDeleteDialogOpen(false);
  setExamToDelete(null);
  }}
  />
  </div>
  );
}

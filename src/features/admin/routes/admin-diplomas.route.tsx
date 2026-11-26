"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { ROUTES } from "@/routes";
import { getClientDiplomas } from "@/features/diplomas/lib/apis/diplomas.api";
import { diplomaKeys } from "@/features/diplomas/lib/apis/diplomas.key";
import { AdminDiplomasFilter } from "../components/admin-diplomas-filter";
import {
  AdminDiplomasTable,
  type SortOption,
} from "../components/admin-diplomas-table";
import { AdminDiplomasTableSkeleton } from "../skeletons/admin-diplomas-table.skeleton";
import { DeleteDiplomaDialog } from "../components/delete-diploma-dialog";
import type { IDiploma, IDiplomasPayload } from "@/shared/lib/types/diploma";

interface AdminDiplomasRouteProps {
  initialData?: IDiplomasPayload;
}

export function AdminDiplomasRoute({ initialData }: AdminDiplomasRouteProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  // 12 items must be displayed per page
  const limit = 12;
  const [search, setSearch] = useState("");
  const [immutable, setImmutable] = useState<boolean | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>("title_asc");
  const [deletingDiploma, setDeletingDiploma] = useState<IDiploma | null>(null);

  // Derive sortBy & sortOrder from sortOption
  const getSortParams = (opt: SortOption) => {
  switch (opt) {
  case "title_desc":
  return { sortBy: "title", sortOrder: "desc" as const };
  case "title_asc":
  return { sortBy: "title", sortOrder: "asc" as const };
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
  refetch,
  } = useQuery({
  queryKey: diplomaKeys.adminList({
  page,
  limit,
  search: search.trim() || undefined,
  immutable,
  sortBy,
  sortOrder,
  }),
  queryFn: () =>
  getClientDiplomas({
  page,
  limit,
  search: search.trim() || undefined,
  immutable,
  sortBy,
  sortOrder,
  }),
  initialData:
  page === 1 && !search && immutable === undefined && sortOption === "title_asc"
  ? initialData
  : undefined,
  initialDataUpdatedAt: 0,
  placeholderData: (prev) => prev,
  });

  const diplomas = data?.data || [];
  const metadata = data?.metadata || {
  page: 1,
  limit: 12,
  total: diplomas.length,
  totalPages: 1,
  };

  const total = metadata.total;
  const totalPages = Math.max(1, metadata.totalPages);
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handleFilterApply = (newSearch: string, newImmutable: boolean | undefined) => {
  setSearch(newSearch);
  setImmutable(newImmutable);
  setPage(1);
  };

  const handleFilterClear = () => {
  setSearch("");
  setImmutable(undefined);
  setPage(1);
  };

  return (
  <div className="space-y-6">
  {/* Top Breadcrumb */}
  <div className="text-xs text-muted-foreground font-mono select-none">
  Diplomas
  </div>

  {/* Top Action Row: Fixed on Scroll with Exact Joined Controls */}
  <div className="sticky top-15 lg:top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-xs py-3 -mt-3 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
  {/* Left: Record Range & Joined Pagination Control */}
  <div className="flex items-center gap-3 sm:gap-4 select-none">
  <span className="text-xs sm:text-sm font-mono text-muted-foreground">
  {startItem} - {endItem} of {total}
  </span>

  {/* Joined Segmented Pagination Controls matching the screenshot */}
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

  {/* Right: + Add New Diploma Green Button (matching screenshot) */}
  <Link
  href={ROUTES.ADMIN.CREATE_DIPLOMA}
  className="w-full sm:w-auto px-4 py-2 bg-[#00B074] hover:bg-[#009663] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
  >
  <Plus className="size-4" />
  <span>Add New Diploma</span>
  </Link>
  </div>

  {/* Search & Filters Accordion */}
  <AdminDiplomasFilter
  initialSearch={search}
  initialImmutable={immutable}
  onApply={handleFilterApply}
  onClear={handleFilterClear}
  />

  {/* Diplomas Table */}
  {isLoading && !diplomas.length ? (
  <AdminDiplomasTableSkeleton />
  ) : (
  <div className="relative">
  {isPlaceholderData && (
  <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center">
  <Loader2 className="size-6 animate-spin text-primary" />
  </div>
  )}
  <AdminDiplomasTable
  diplomas={diplomas}
  currentSort={sortOption}
  onSortChange={(opt) => {
  setSortOption(opt);
  setPage(1);
  }}
  onEdit={(diploma) => {
  router.push(ROUTES.ADMIN.EDIT_DIPLOMA(diploma.id));
  }}
  onDelete={(diploma) => {
  setDeletingDiploma(diploma);
  }}
  />
  </div>
  )}

  {/* Delete Confirmation Dialog */}
  <DeleteDiplomaDialog
  isOpen={!!deletingDiploma}
  diploma={deletingDiploma}
  onClose={() => setDeletingDiploma(null)}
  onSuccess={() => refetch()}
  />
  </div>
  );
}

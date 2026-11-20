"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { getClientDiplomas } from "@/features/diplomas/lib/apis/diplomas.api";
import { AdminDiplomasFilter } from "../components/admin-diplomas-filter";
import {
  AdminDiplomasTable,
  type SortOption,
} from "../components/admin-diplomas-table";
import { AdminDiplomasTableSkeleton } from "../skeletons/admin-diplomas-table.skeleton";
import type { IDiplomasPayload } from "@/shared/lib/types/diploma";

interface AdminDiplomasRouteProps {
  initialData?: IDiplomasPayload;
}

export function AdminDiplomasRoute({ initialData }: AdminDiplomasRouteProps) {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState("");
  const [immutable, setImmutable] = useState<boolean | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>("title_asc");

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
  } = useQuery({
    queryKey: [
      "admin-diplomas",
      { page, limit, search, immutable, sortBy, sortOrder },
    ],
    queryFn: () =>
      getClientDiplomas({
        page,
        limit,
        search: search.trim() || undefined,
        immutable,
        sortBy,
        sortOrder,
      }),
    initialData: page === 1 && !search && immutable === undefined ? initialData : undefined,
    placeholderData: (prev) => prev,
  });

  const diplomas = data?.data || [];
  const metadata = data?.metadata || {
    page: 1,
    limit: 20,
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

      {/* Top Action Row: Record Counter & Pagination & Add New Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Record Range & Prev/Next Controls */}
        <div className="flex items-center gap-3 sm:gap-4 select-none">
          <span className="text-xs sm:text-sm font-mono text-muted-foreground">
            {startItem} - {endItem} of {total}
          </span>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isPlaceholderData}
              aria-label="Previous page"
              className="size-8 rounded-lg border border-border/80 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="px-2 py-1 text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isPlaceholderData}
              aria-label="Next page"
              className="size-8 rounded-lg border border-border/80 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-foreground transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Right: + Add New Diploma Green Button (matching screenshot) */}
        <button
          type="button"
          onClick={() => alert("Add New Diploma modal/form will be connected in next step.")}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#00B074] hover:bg-[#009663] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
        >
          <Plus className="size-4" />
          <span>Add New Diploma</span>
        </button>
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
              alert(`Edit ${diploma.title} will be connected in next step.`);
            }}
            onDelete={(diploma) => {
              alert(`Delete ${diploma.title} will be connected in next step.`);
            }}
          />
        </div>
      )}
    </div>
  );
}

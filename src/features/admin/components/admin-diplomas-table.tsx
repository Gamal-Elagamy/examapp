"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { ROUTES } from "@/routes";
import type { IDiploma } from "@/shared/lib/types/diploma";

export type SortOption =
  | "title_desc"
  | "title_asc"
  | "newest_desc"
  | "newest_asc";

interface AdminDiplomasTableProps {
  diplomas: IDiploma[];
  currentSort?: SortOption;
  onSortChange: (sort: SortOption) => void;
  onEdit?: (diploma: IDiploma) => void;
  onDelete?: (diploma: IDiploma) => void;
}

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "title_desc", label: "Title (descending)" },
  { id: "title_asc", label: "Title (ascending)" },
  { id: "newest_desc", label: "Newest (descending)" },
  { id: "newest_asc", label: "Newest (ascending)" },
];

export function AdminDiplomasTable({
  diplomas,
  currentSort = "title_asc",
  onSortChange,
  onEdit,
  onDelete,
}: AdminDiplomasTableProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  // Active action menu id
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Hovered title for tooltip
  const [hoveredTitleId, setHoveredTitleId] = useState<string | null>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-lg border border-border/80 bg-white shadow-2xs overflow-visible">
      {/* Table Header: Solid Blue Bar */}
      <div className="bg-primary text-white text-xs font-semibold px-4 py-3 rounded-t-lg flex items-center justify-between select-none">
        <div className="flex items-center gap-6 sm:gap-10 flex-1 min-w-0">
          <span className="w-16 shrink-0 font-mono">Image</span>
          <span className="w-40 sm:w-52 shrink-0 font-mono">Title</span>
          <span className="hidden md:inline flex-1 font-mono">Description</span>
        </div>

        {/* Sort Trigger & Dropdown Menu */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/10 transition-colors text-xs font-mono font-medium cursor-pointer"
          >
            <span>Sort</span>
            <ArrowUpDown className="size-3.5" />
          </button>

          {isSortOpen && (
            <div className="absolute inset-e-0 top-full mt-2 w-52 rounded-xl border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95">
              {SORT_OPTIONS.map((opt) => {
                const isActive = currentSort === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-start transition-colors font-mono cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 text-foreground"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isActive && <Check className="size-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Table Rows List */}
      <div className="divide-y divide-border/60">
        {diplomas.map((diploma) => {
          const isMenuOpen = activeMenuId === diploma.id;
          const isTooltipVisible = hoveredTitleId === diploma.id;
          const isLongTitle = diploma.title.length > 20;

          return (
            <div
              key={diploma.id}
              className="px-4 py-3.5 flex items-center justify-between gap-4 sm:gap-6 hover:bg-slate-50/70 transition-colors relative"
            >
              {/* Row Left Section: Thumbnail & Title & Description */}
              <div className="flex items-center gap-6 sm:gap-10 flex-1 min-w-0">
                {/* Thumbnail */}
                <div className="size-14 sm:size-16 rounded-xl bg-slate-100 border border-border/60 overflow-hidden shrink-0 flex items-center justify-center">
                  {diploma.image ? (
                    <Image
                      src={diploma.image}
                      alt={diploma.title}
                      width={64}
                      height={64}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-mono">No Image</span>
                  )}
                </div>

                {/* Title with Tooltip on Hover */}
                <div
                  className="w-40 sm:w-52 shrink-0 relative"
                  onMouseEnter={() => setHoveredTitleId(diploma.id)}
                  onMouseLeave={() => setHoveredTitleId(null)}
                >
                  <Link
                    href={ROUTES.ADMIN.DIPLOMA_DETAILS(diploma.id)}
                    className="font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors font-mono line-clamp-1 block"
                  >
                    {diploma.title}
                  </Link>

                  {/* Tooltip Hover Bubble (matching screenshot) */}
                  {isTooltipVisible && isLongTitle && (
                    <div className="absolute bottom-full inset-s-0 mb-2 z-40 bg-slate-900 text-white text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in-50 duration-150 pointer-events-none">
                      {diploma.title}
                      {/* Tooltip arrow */}
                      <div className="absolute top-full inset-s-4 -mt-1 border-4 border-transparent border-t-slate-900" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="hidden md:block flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed line-clamp-3">
                    {diploma.description}
                  </p>
                </div>
              </div>

              {/* Action Menu Trigger (Three dots `...`) */}
              <div
                className="relative shrink-0"
                ref={isMenuOpen ? menuRef : undefined}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenuId(isMenuOpen ? null : diploma.id)
                  }
                  aria-label="Actions"
                  className="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="size-4" />
                </button>

                {/* Actions Dropdown: View, Edit, Delete (matching screenshot) */}
                {isMenuOpen && (
                  <div className="absolute inset-e-0 top-full mt-1.5 w-36 rounded-xl border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 font-mono">
                    {/* View Action */}
                    <Link
                      href={ROUTES.ADMIN.DIPLOMA_DETAILS(diploma.id)}
                      onClick={() => setActiveMenuId(null)}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors font-medium cursor-pointer"
                    >
                      <Eye className="size-4 text-emerald-600" />
                      <span>View</span>
                    </Link>

                    {/* Edit Action */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuId(null);
                        onEdit?.(diploma);
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors font-medium cursor-pointer"
                    >
                      <Pencil className="size-4 text-primary" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Action */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuId(null);
                        onDelete?.(diploma);
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium cursor-pointer"
                    >
                      <Trash2 className="size-4 text-destructive" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {diplomas.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-foreground font-mono">
              No Diplomas Found
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  ArrowUpDown,
  Check,
  Eye,
  Pencil,
  Trash2,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { ROUTES } from "@/routes";
import type { IExam } from "@/shared/lib/types/exam";

export type ExamSortOption =
  | "title_desc"
  | "title_asc"
  | "questions_desc"
  | "questions_asc"
  | "newest_desc"
  | "newest_asc";

interface AdminExamsTableProps {
  exams: IExam[];
  currentSort?: ExamSortOption;
  onSortChange?: (option: ExamSortOption) => void;
  onView?: (exam: IExam) => void;
  onEdit?: (exam: IExam) => void;
  onDelete?: (exam: IExam) => void;
  onAddQuestions?: (exam: IExam) => void;
}

const SORT_OPTIONS: { id: ExamSortOption; label: string }[] = [
  { id: "title_desc", label: "Title (descending)" },
  { id: "title_asc", label: "Title (ascending)" },
  { id: "questions_desc", label: "Questions No. (descending)" },
  { id: "questions_asc", label: "Questions No. (ascending)" },
  { id: "newest_desc", label: "Newest (descending)" },
  { id: "newest_asc", label: "Newest (ascending)" },
];

export function AdminExamsTable({
  exams,
  currentSort = "title_asc",
  onSortChange,
  onView,
  onEdit,
  onDelete,
  onAddQuestions,
}: AdminExamsTableProps) {
  const router = useRouter();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [hoveredTitleId, setHoveredTitleId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-2xl border border-border/80 bg-white shadow-2xs overflow-visible">
      {/* Table Header: Blue Banner (matching screenshot) */}
      <div className="bg-primary text-white px-4 py-3 sm:px-6 flex items-center justify-between text-xs font-mono font-semibold rounded-t-2xl select-none">
        <div className="flex items-center gap-6 sm:gap-10 flex-1 min-w-0">
          <span className="w-14 sm:w-16 shrink-0">Image</span>
          <span className="w-48 sm:w-72 shrink-0">Title</span>
          <span className="hidden md:block flex-1 min-w-0">Diploma</span>
          <span className="hidden sm:block w-28 text-center shrink-0">
            No. of Questions
          </span>
        </div>

        {/* Sort Menu Trigger */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-white/10"
            aria-label="Sort options"
          >
            <span>Sort</span>
            <ArrowUpDown className="size-3.5" />
          </button>

          {/* Sort Dropdown Menu (matching screenshot) */}
          {isSortOpen && (
            <div className="absolute inset-e-0 top-full mt-2 w-56 rounded-xl border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 font-mono">
              {SORT_OPTIONS.map((opt) => {
                const isActive = currentSort === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSortChange?.(opt.id);
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

      {/* Table Rows List with Full Row Hover */}
      <div className="divide-y divide-border/60">
        {exams.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground font-mono text-sm">
            No exams found matching your criteria.
          </div>
        ) : (
          exams.map((exam) => {
            const isMenuOpen = activeMenuId === exam.id;
            const isTooltipVisible = hoveredTitleId === exam.id;
            const isLongTitle = exam.title.length > 28;

            const diplomaTitle =
              typeof exam.diploma === "object"
                ? exam.diploma?.title
                : exam.diploma || "—";

            const questionsCount =
              exam.numberOfQuestions ?? (exam as { questionsCount?: number }).questionsCount ?? 0;

            return (
              <div
                key={exam.id}
                onClick={() => {
                  if (onView) {
                    onView(exam);
                  } else {
                    router.push(ROUTES.ADMIN.EXAM_DETAILS(exam.id));
                  }
                }}
                className="group px-4 py-3.5 flex items-center justify-between gap-4 sm:gap-6 hover:bg-slate-50 transition-all duration-150 relative cursor-pointer"
              >
                {/* Row Content */}
                <div className="flex items-center gap-6 sm:gap-10 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="size-14 sm:size-16 rounded-xl bg-slate-100 border border-border/60 overflow-hidden shrink-0 flex items-center justify-center transition-transform duration-150 group-hover:scale-102">
                    {exam.image ? (
                      <Image
                        src={exam.image}
                        alt={exam.title}
                        width={64}
                        height={64}
                        className="size-full object-cover"
                      />
                    ) : (
                      <BookOpen className="size-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Title with Tooltip on Hover */}
                  <div
                    className="w-48 sm:w-72 shrink-0 relative"
                    onMouseEnter={() => setHoveredTitleId(exam.id)}
                    onMouseLeave={() => setHoveredTitleId(null)}
                  >
                    <Link
                      href={ROUTES.ADMIN.EXAM_DETAILS(exam.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors font-mono line-clamp-2 block"
                    >
                      {exam.title}
                    </Link>

                    {/* Tooltip Hover Bubble */}
                    {isTooltipVisible && isLongTitle && (
                      <div className="absolute bottom-full inset-s-0 mb-2 z-40 bg-slate-900 text-white text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in-50 duration-150 pointer-events-none">
                        {exam.title}
                        <div className="absolute top-full inset-s-4 -mt-1 border-4 border-transparent border-t-slate-900" />
                      </div>
                    )}
                  </div>

                  {/* Diploma Name */}
                  <div className="hidden md:block flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {diplomaTitle}
                    </p>
                  </div>

                  {/* Number of Questions */}
                  <div className="hidden sm:block w-28 text-center shrink-0">
                    <span className="text-xs sm:text-sm font-mono font-medium text-foreground">
                      {questionsCount}
                    </span>
                  </div>
                </div>

                {/* Action Menu Trigger (Three dots `...`) */}
                <div
                  className="relative shrink-0"
                  ref={isMenuOpen ? menuRef : undefined}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId(isMenuOpen ? null : exam.id)
                    }
                    aria-label="Actions"
                    className="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>

                  {/* Actions Dropdown: View, Edit, Delete, Add Questions (matching user requirement) */}
                  {isMenuOpen && (
                    <div className="absolute inset-e-0 top-full mt-1.5 w-44 rounded-xl border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 font-mono">
                      {/* View Action */}
                      <Link
                        href={ROUTES.ADMIN.EXAM_DETAILS(exam.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          onView?.(exam);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors font-medium cursor-pointer"
                      >
                        <Eye className="size-4 text-emerald-600" />
                        <span>View</span>
                      </Link>

                      {/* Edit Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          onEdit?.(exam);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors font-medium cursor-pointer"
                      >
                        <Pencil className="size-4 text-primary" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          onDelete?.(exam);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium cursor-pointer"
                      >
                        <Trash2 className="size-4 text-destructive" />
                        <span>Delete</span>
                      </button>

                      {/* Add Questions Action (matching user requirement) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          onAddQuestions?.(exam);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors font-medium cursor-pointer"
                      >
                        <HelpCircle className="size-4 text-indigo-600" />
                        <span>Add Questions</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

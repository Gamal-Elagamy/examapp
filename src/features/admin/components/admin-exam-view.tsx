"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Ban,
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  BookOpen,
  Loader2,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { getClientUpdateExam } from "@/features/exams/lib/apis/exams.api";
import { examKeys } from "@/features/exams/lib/apis/exams.key";
import { DeleteExamDialog } from "./delete-exam-dialog";
import { DeleteQuestionDialog } from "./delete-question-dialog";
import type { IExamDetails } from "@/shared/lib/types/exam";
import type { IQuestion } from "@/shared/lib/types/question";

interface AdminExamViewProps {
  exam: IExamDetails;
  initialQuestions?: IQuestion[];
}

export function AdminExamView({ exam, initialQuestions = [] }: AdminExamViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isSuperAdmin = session?.user?.role === USER_ROLES.SUPER_ADMIN;

  const [questions, setQuestions] = useState<IQuestion[]>(initialQuestions);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showImmutabilityTooltip, setShowImmutabilityTooltip] = useState(false);
  const [isTogglingImmutable, setIsTogglingImmutable] = useState(false);
  const [isImmutable, setIsImmutable] = useState(Boolean(exam.immutable));
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuestionToDelete, setSelectedQuestionToDelete] =
  useState<IQuestion | null>(null);

  const isActionRestricted = isImmutable && !isSuperAdmin;

  const handleToggleImmutable = async () => {
  if (!isSuperAdmin || isTogglingImmutable) return;
  setIsTogglingImmutable(true);
  try {
  const nextState = !isImmutable;
  await getClientUpdateExam(exam.id, {
  title: exam.title,
  description: exam.description || "",
  image: exam.image || "",
  duration: exam.duration,
  diplomaId: exam.diplomaId || exam.diploma?.id || "",
  immutable: nextState,
  });
  setIsImmutable(nextState);
  queryClient.invalidateQueries({ queryKey: examKeys.detail(exam.id) });
  queryClient.invalidateQueries({ queryKey: examKeys.adminLists() });
  toast.success(nextState ? "Exam is now immutable" : "Exam is now mutable");
  } catch (err) {
  toast.error(err instanceof Error ? err.message : "Failed to toggle immutability");
  } finally {
  setIsTogglingImmutable(false);
  }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  // Close question menu on click outside
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
  if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  setActiveMenuId(null);
  }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sort questions by title/text
  const handleSortToggle = () => {
  const nextOrder = sortOrder === "asc" ? "desc" : "asc";
  setSortOrder(nextOrder);
  setQuestions((prev) =>
  [...prev].sort((a, b) => {
  const textA = a.text.toLowerCase();
  const textB = b.text.toLowerCase();
  return nextOrder === "asc"
  ? textA.localeCompare(textB)
  : textB.localeCompare(textA);
  }),
  );
  };

  const diplomaTitle =
  typeof exam.diploma === "object"
  ? exam.diploma?.title
  : exam.diploma || "—";

  const diplomaId =
  typeof exam.diploma === "object" ? exam.diploma?.id : exam.diplomaId;

  const questionsCount =
  exam.numberOfQuestions ?? exam.questionsCount ?? questions.length;

  return (
  <div className="space-y-6 max-w-5xl">
  {/* Top Breadcrumb Navigation */}
  <nav
  aria-label="Breadcrumb"
  className="flex items-center gap-2 text-xs text-muted-foreground font-mono"
  >
  <Link
  href={ROUTES.ADMIN.EXAMS}
  className="hover:text-primary transition-colors cursor-pointer"
  >
  Exams
  </Link>
  <span>/</span>
  <span className="text-primary font-semibold truncate max-w-72">
  {exam.title}
  </span>
  </nav>

  {/* Header Row: Title & Action Buttons */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="space-y-1">
  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
  {exam.title}
  </h1>
  <p className="text-xs sm:text-sm text-muted-foreground font-mono flex items-center gap-1.5">
  <span>Diploma:</span>
  {diplomaId ? (
  <Link
  href={ROUTES.ADMIN.DIPLOMA_DETAILS(diplomaId)}
  className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
  >
  {diplomaTitle}
  <ExternalLink className="size-3" />
  </Link>
  ) : (
  <span>{diplomaTitle}</span>
  )}
  </p>
  </div>

  <div className="flex items-center gap-3 select-none flex-wrap">
  {/* Immutability Button with Tooltip for non-super admins */}
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
  <Ban className="size-3.5 text-slate-500" />
  )}
  <span>Immutable</span>
  </button>

  {/* Immutability Toggle Tooltip */}
  {!isSuperAdmin && showImmutabilityTooltip && (
  <div className="absolute bottom-full inset-s-1/2 -translate-x-1/2 mb-2 z-50 bg-slate-900 text-white text-[11px] font-mono px-3 py-1.5 shadow-xl whitespace-nowrap animate-in fade-in-50 duration-150 pointer-events-none">
  Only super admins are allowed to toggle the immutability
  <div className="absolute top-full inset-s-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
  </div>
  )}
  </div>

  {/* Edit Button */}
  {isActionRestricted ? (
  <button
  type="button"
  disabled
  title="Only super admins can edit an immutable exam"
  className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-400 text-xs font-semibold shadow-xs cursor-not-allowed select-none"
  >
  <Pencil className="size-3.5" />
  <span>Edit</span>
  </button>
  ) : (
  <Link
  href={ROUTES.ADMIN.EDIT_EXAM(exam.id)}
  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
  >
  <Pencil className="size-3.5" />
  <span>Edit</span>
  </Link>
  )}

  {/* Delete Button */}
  <button
  type="button"
  disabled={isActionRestricted}
  title={isActionRestricted ? "Only super admins can delete an immutable exam" : undefined}
  onClick={() => !isActionRestricted && setIsDeleteDialogOpen(true)}
  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold shadow-xs transition-colors ${
  isActionRestricted
  ? "bg-slate-200 text-slate-400 cursor-not-allowed select-none"
  : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
  }`}
  >
  <Trash2 className="size-3.5" />
  <span>Delete</span>
  </button>
  </div>
  </div>

  {/* Main Exam Details Card */}
  <div className="border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
  {/* Section 1: Image */}
  <div className="space-y-2">
  <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
  Image
  </span>
  <div className="w-72 sm:w-80 aspect-square bg-slate-100 border border-border/60 overflow-hidden relative shadow-xs flex items-center justify-center">
  {exam.image ? (
  <Image
  src={exam.image}
  alt={exam.title}
  width={320}
  height={320}
  unoptimized
  className="size-full object-cover"
  />
  ) : (
  <div className="flex flex-col items-center gap-2 text-muted-foreground">
  <BookOpen className="size-10" />
  <span className="text-xs font-mono">No Image</span>
  </div>
  )}
  </div>
  </div>

  {/* Section 2: Title */}
  <div className="space-y-1.5 pt-2">
  <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
  Title
  </span>
  <p className="text-sm sm:text-base font-bold text-foreground font-mono">
  {exam.title}
  </p>
  </div>

  {/* Section 3: Description */}
  <div className="space-y-1.5 pt-2">
  <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
  Description
  </span>
  <p className="text-xs sm:text-sm text-foreground/80 font-mono leading-relaxed max-w-3xl">
  {exam.description}
  </p>
  </div>

  {/* Section 4: Diploma */}
  <div className="space-y-1.5 pt-2">
  <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
  Diploma
  </span>
  <div>
  {diplomaId ? (
  <Link
  href={ROUTES.ADMIN.DIPLOMA_DETAILS(diplomaId)}
  className="text-xs sm:text-sm text-primary font-mono hover:underline inline-flex items-center gap-1 font-semibold"
  >
  {diplomaTitle}
  <ExternalLink className="size-3.5" />
  </Link>
  ) : (
  <span className="text-xs sm:text-sm text-foreground font-mono">
  {diplomaTitle}
  </span>
  )}
  </div>
  </div>

  {/* Section 5: Duration */}
  <div className="space-y-1.5 pt-2">
  <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
  Duration
  </span>
  <p className="text-xs sm:text-sm font-bold text-foreground font-mono">
  {exam.duration} Minutes
  </p>
  </div>

  {/* Section 6: No. of Questions */}
  <div className="space-y-1.5 pt-2">
  <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
  No. of Questions
  </span>
  <p className="text-xs sm:text-sm font-bold text-foreground font-mono">
  {questionsCount}
  </p>
  </div>
  </div>

  {/* Exam Questions Section Card */}
  <div className="border border-border/80 bg-white overflow-hidden shadow-2xs">
  {/* Blue Header Bar */}
  <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground">
  <h2 className="text-sm sm:text-base font-bold font-mono">
  Exam Questions
  </h2>
  <button
  type="button"
  onClick={() => router.push(ROUTES.ADMIN.CREATE_QUESTION(exam.id))}
  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white font-mono text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
  >
  <Plus className="size-3.5" />
  <span>Add Questions</span>
  </button>
  </div>

  {/* Subheader with Title and Sort */}
  <div className="bg-slate-100/90 border-b border-border/80 px-6 py-3 flex items-center justify-between text-xs font-mono font-bold text-slate-700 select-none">
  <span>Title</span>
  <button
  type="button"
  onClick={handleSortToggle}
  className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
  >
  <span>Sort</span>
  <ArrowUpDown className="size-3.5" />
  </button>
  </div>

  {/* Questions List */}
  <div className="divide-y divide-border/60">
  {questions.length === 0 ? (
  <div className="py-12 text-center text-muted-foreground font-mono text-xs sm:text-sm">
  No questions found for this exam.
  </div>
  ) : (
  questions.map((question) => {
  const isMenuOpen = activeMenuId === question.id;

  return (
  <div
  key={question.id}
  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors group relative"
  >
  <Link
  href={ROUTES.ADMIN.QUESTION_DETAILS(exam.id, question.id)}
  className="text-xs sm:text-sm text-foreground hover:text-primary transition-colors font-mono flex-1 leading-relaxed cursor-pointer"
  >
  {question.text}
  </Link>

  {/* Actions Dropdown for Question */}
  <div
  className="relative shrink-0"
  ref={isMenuOpen ? menuRef : undefined}
  >
  <button
  type="button"
  onClick={() =>
  setActiveMenuId(isMenuOpen ? null : question.id)
  }
  aria-label="Question actions"
  className="size-8 bg-slate-100 hover:bg-slate-200 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
  >
  <MoreHorizontal className="size-4" />
  </button>

  {isMenuOpen && (
  <div className="absolute inset-e-0 top-full mt-1.5 w-36 border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 font-mono">
  <button
  type="button"
  onClick={() => {
  setActiveMenuId(null);
  router.push(
  ROUTES.ADMIN.QUESTION_DETAILS(exam.id, question.id),
  );
  }}
  className="flex items-center gap-2.5 w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 transition-colors font-medium cursor-pointer"
  >
  <Eye className="size-3.5 text-emerald-600" />
  <span>View</span>
  </button>
  <button
  type="button"
  onClick={() => {
  setActiveMenuId(null);
  router.push(
  ROUTES.ADMIN.EDIT_QUESTION(exam.id, question.id),
  );
  }}
  className="flex items-center gap-2.5 w-full px-3 py-2 text-primary hover:bg-primary/10 transition-colors font-medium cursor-pointer"
  >
  <Pencil className="size-3.5 text-primary" />
  <span>Edit</span>
  </button>
  <button
  type="button"
  onClick={() => {
  setActiveMenuId(null);
  setSelectedQuestionToDelete(question);
  }}
  className="flex items-center gap-2.5 w-full px-3 py-2 text-destructive hover:bg-destructive/10 transition-colors font-medium cursor-pointer"
  >
  <Trash2 className="size-3.5 text-destructive" />
  <span>Delete</span>
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

  {/* Back Link */}
  <div className="pt-2">
  <Link
  href={ROUTES.ADMIN.EXAMS}
  className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
  >
  <ArrowLeft className="size-3.5" />
  <span>Back to Exams</span>
  </Link>
  </div>

  {/* Delete Exam Confirmation Dialog */}
  <DeleteExamDialog
  isOpen={isDeleteDialogOpen}
  exam={exam}
  onClose={() => setIsDeleteDialogOpen(false)}
  />

  {/* Delete Question Confirmation Dialog */}
  <DeleteQuestionDialog
  isOpen={Boolean(selectedQuestionToDelete)}
  question={selectedQuestionToDelete}
  onClose={() => setSelectedQuestionToDelete(null)}
  onSuccess={() => {
  if (selectedQuestionToDelete) {
  setQuestions((prev) =>
  prev.filter((q) => q.id !== selectedQuestionToDelete.id),
  );
  }
  }}
  />
  </div>
  );
}

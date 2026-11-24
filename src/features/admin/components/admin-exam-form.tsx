"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Save,
  Loader2,
  UploadCloud,
  ChevronRight,
  Trash2,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  FileImage,
  ExternalLink,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import {
  examFormSchema,
  type ExamFormValues,
} from "@/features/exams/lib/schemas/exam.schema";
import { useCreateExam } from "@/features/exams/hooks/use-create-exam";
import { useUpdateExam } from "@/features/exams/hooks/use-update-exam";
import { getClientUploadFile } from "@/shared/lib/apis/upload.api";
import type { IExamDetails } from "@/shared/lib/types/exam";
import type { IQuestion } from "@/shared/lib/types/question";

interface AdminExamFormProps {
  initialExam?: IExamDetails;
  isEditing?: boolean;
  initialQuestions?: IQuestion[];
  diplomas: { id: string; title: string }[];
}

export function AdminExamForm({
  initialExam,
  isEditing = false,
  initialQuestions = [],
  diplomas = [],
}: AdminExamFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === USER_ROLES.SUPER_ADMIN;

  // Image states
  const [imagePreview, setImagePreview] = useState<string>(
    initialExam?.image || "",
  );
  const [imageFileName, setImageFileName] = useState<string>(
    initialExam?.image ? initialExam.image.split("/").pop() || "exam-image.png" : "",
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Questions state (only relevant for editing)
  const [questions] = useState<IQuestion[]>(initialQuestions);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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

  // Mutation hooks
  const createMutation = useCreateExam();
  const updateMutation = useUpdateExam();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError =
    createMutation.error?.message || updateMutation.error?.message;

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: initialExam?.title || "",
      description: initialExam?.description || "",
      image: initialExam?.image || "",
      duration: initialExam?.duration || 20,
      diplomaId:
        (typeof initialExam?.diploma === "object"
          ? initialExam?.diploma?.id
          : initialExam?.diplomaId) || "",
    },
  });

  // Handle Image File Upload
  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);
    setImageFileName(file.name);

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await getClientUploadFile(formData);
      setImagePreview(res.url);
      setValue("image", res.url, { shouldValidate: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setUploadError(msg);
      setImagePreview(initialExam?.image || "");
      setValue("image", initialExam?.image || "");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFileName("");
    setValue("image", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (values: ExamFormValues) => {
    if (isEditing && initialExam) {
      updateMutation.mutate({
        id: initialExam.id,
        payload: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const diplomaTitle =
    typeof initialExam?.diploma === "object"
      ? initialExam.diploma?.title
      : initialExam?.diploma || "";

  const diplomaId =
    typeof initialExam?.diploma === "object"
      ? initialExam.diploma?.id
      : initialExam?.diplomaId;

  // Immutability rule for questions actions:
  // When exam is immutable, edit/delete are only enabled for super admins
  const isQuestionActionRestricted = Boolean(initialExam?.immutable && !isSuperAdmin);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
      {/* Top Header Row: Breadcrumb on left, Cancel & Save buttons on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Breadcrumb Navigation & Title */}
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground flex-wrap"
          >
            <Link
              href={ROUTES.ADMIN.EXAMS}
              className="hover:text-primary transition-colors hover:underline cursor-pointer"
            >
              Exams
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            {isEditing && initialExam ? (
              <>
                <Link
                  href={ROUTES.ADMIN.EXAM_DETAILS(initialExam.id)}
                  className="hover:text-primary transition-colors hover:underline truncate max-w-48 sm:max-w-72 cursor-pointer"
                >
                  {initialExam.title}
                </Link>
                <ChevronRight className="size-3 text-slate-400" />
                <span className="text-primary font-semibold">Edit</span>
              </>
            ) : (
              <span className="text-primary font-semibold">Create New Exam</span>
            )}
          </nav>

          {isEditing && initialExam && (
            <div className="pt-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                {initialExam.title}
              </h1>
              {diplomaId && (
                <p className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                  <span>Diploma:</span>
                  <Link
                    href={ROUTES.ADMIN.DIPLOMA_DETAILS(diplomaId)}
                    className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    {diplomaTitle}
                    <ExternalLink className="size-3" />
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Cancel & Save */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <Link
            href={
              isEditing && initialExam
                ? ROUTES.ADMIN.EXAM_DETAILS(initialExam.id)
                : ROUTES.ADMIN.EXAMS
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-medium transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
            <span>Cancel</span>
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#00B074] hover:bg-[#009E68] text-white font-mono text-xs font-medium shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50 select-none"
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>{isSubmitting ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {submitError && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
          {submitError}
        </div>
      )}

      {/* Card 1: Exam Information */}
      <div className="rounded-2xl overflow-hidden border border-border/80 shadow-2xs bg-white">
        <div className="bg-primary text-white font-mono font-semibold text-xs sm:text-sm px-6 py-4">
          Exam Information
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Row 1: Title (left) & Diploma (right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="exam-title"
                className="text-xs font-mono font-semibold text-slate-700 block"
              >
                Title
              </label>
              <input
                id="exam-title"
                type="text"
                placeholder="Enter exam title"
                {...register("title")}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.title
                    ? "border-destructive focus:border-destructive"
                    : "border-border/80 focus:border-primary"
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-destructive font-mono mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Diploma Dropdown Select */}
            <div className="space-y-1.5">
              <label
                htmlFor="exam-diploma"
                className="text-xs font-mono font-semibold text-slate-700 block"
              >
                Diploma
              </label>
              <select
                id="exam-diploma"
                {...register("diplomaId")}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                  errors.diplomaId
                    ? "border-destructive focus:border-destructive"
                    : "border-border/80 focus:border-primary"
                }`}
              >
                <option value="">Select a diploma</option>
                {diplomas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
              {errors.diplomaId && (
                <p className="text-[11px] text-destructive font-mono mt-1">
                  {errors.diplomaId.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Image (left) & Description (right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Upload Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-700 block">
                Image
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                /* Selected / Uploaded Image View (matching screenshot) */
                <div className="rounded-xl border border-border/80 p-3 bg-slate-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-14 sm:size-16 rounded-lg overflow-hidden border border-border bg-white shadow-2xs shrink-0">
                      <Image
                        src={imagePreview}
                        alt="Exam image"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center text-white">
                          <Loader2 className="size-5 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-mono text-foreground font-semibold truncate max-w-44 sm:max-w-56">
                        {imageFileName || "exam-image.png"}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Ready
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      title="Change image"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-slate-200/60 transition-colors cursor-pointer"
                    >
                      <UploadCloud className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isUploadingImage}
                      title="Remove image"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Dropzone Area */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleUploadFile(file);
                  }}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-28 ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border/80 hover:border-primary/60 hover:bg-slate-50/50"
                  } ${errors.image ? "border-destructive bg-destructive/5" : ""}`}
                >
                  <FileImage className="size-6 text-muted-foreground mb-1.5" />
                  <p className="text-xs font-mono text-muted-foreground">
                    Drop an image here or{" "}
                    <span className="text-primary font-semibold hover:underline">
                      select from your computer
                    </span>
                  </p>
                </div>
              )}

              {uploadError && (
                <p className="text-[11px] text-destructive font-mono mt-1">
                  {uploadError}
                </p>
              )}
              {errors.image && !uploadError && (
                <p className="text-[11px] text-destructive font-mono mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="exam-description"
                className="text-xs font-mono font-semibold text-slate-700 block"
              >
                Description
              </label>
              <textarea
                id="exam-description"
                rows={3}
                placeholder="Enter comprehensive exam description"
                {...register("description")}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                  errors.description
                    ? "border-destructive focus:border-destructive"
                    : "border-border/80 focus:border-primary"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-destructive font-mono mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Duration (min) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="exam-duration"
                className="text-xs font-mono font-semibold text-slate-700 block"
              >
                Duration (min)
              </label>
              <input
                id="exam-duration"
                type="number"
                min={1}
                max={300}
                placeholder="20"
                {...register("duration", { valueAsNumber: true })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.duration
                    ? "border-destructive focus:border-destructive"
                    : "border-border/80 focus:border-primary"
                }`}
              />
              {errors.duration && (
                <p className="text-[11px] text-destructive font-mono mt-1">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Exam Questions (Visible when editing) */}
      {isEditing && (
        <div className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-2xs">
          {/* Blue Header Bar */}
          <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground">
            <h2 className="text-sm sm:text-base font-bold font-mono">
              Exam Questions
            </h2>
            <button
              type="button"
              onClick={() => {
                if (initialExam?.id) {
                  router.push(ROUTES.ADMIN.CREATE_QUESTION(initialExam.id));
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-mono text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Questions</span>
            </button>
          </div>

          {/* Subheader */}
          <div className="bg-slate-100/90 border-b border-border/80 px-6 py-3 text-xs font-mono font-bold text-slate-700 select-none">
            Title
          </div>

          {/* Questions List */}
          <div className="divide-y divide-border/60">
            {questions.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground font-mono text-xs">
                No questions found for this exam.
              </div>
            ) : (
              questions.map((question) => {
                const isMenuOpen = activeMenuId === question.id;

                return (
                  <div
                    key={question.id}
                    className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors group relative"
                  >
                    <p className="text-xs sm:text-sm text-foreground font-mono flex-1 leading-relaxed">
                      {question.text}
                    </p>

                    {/* Actions Menu Trigger */}
                    <div
                      className="relative shrink-0"
                      ref={isMenuOpen ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : question.id)
                        }
                        aria-label="Actions"
                        className="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>

                      {/* Actions Menu: Immutability restrictions apply */}
                      {isMenuOpen && (
                        <div className="absolute inset-e-0 top-full mt-1.5 w-40 rounded-xl border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 font-mono">
                          {/* View Question (always enabled) */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (initialExam?.id) {
                                router.push(
                                  ROUTES.ADMIN.QUESTION_DETAILS(
                                    initialExam.id,
                                    question.id,
                                  ),
                                );
                              }
                            }}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors font-medium cursor-pointer"
                          >
                            <Eye className="size-3.5 text-emerald-600" />
                            <span>View</span>
                          </button>

                          {/* Edit Question */}
                          <button
                            type="button"
                            disabled={isQuestionActionRestricted}
                            onClick={() => {
                              if (!isQuestionActionRestricted && initialExam?.id) {
                                setActiveMenuId(null);
                                router.push(
                                  ROUTES.ADMIN.EDIT_QUESTION(
                                    initialExam.id,
                                    question.id,
                                  ),
                                );
                              }
                            }}
                            title={
                              isQuestionActionRestricted
                                ? "Only super admins can edit questions when exam is immutable"
                                : undefined
                            }
                            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                              isQuestionActionRestricted
                                ? "opacity-40 cursor-not-allowed text-muted-foreground"
                                : "text-primary hover:bg-primary/10 cursor-pointer"
                            }`}
                          >
                            <Pencil className="size-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Question */}
                          <button
                            type="button"
                            disabled={isQuestionActionRestricted}
                            onClick={() => {
                              if (!isQuestionActionRestricted) {
                                setActiveMenuId(null);
                              }
                            }}
                            title={
                              isQuestionActionRestricted
                                ? "Only super admins can delete questions when exam is immutable"
                                : undefined
                            }
                            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                              isQuestionActionRestricted
                                ? "opacity-40 cursor-not-allowed text-muted-foreground"
                                : "text-destructive hover:bg-destructive/10 cursor-pointer"
                            }`}
                          >
                            <Trash2 className="size-3.5" />
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
      )}
    </form>
  );
}

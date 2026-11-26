"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Save,
  Loader2,
  FileImage,
  UploadCloud,
  ChevronRight,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { ROUTES } from "@/routes";
import {
  diplomaFormSchema,
  type DiplomaFormValues,
} from "@/features/diplomas/lib/schemas/diploma.schema";
import { useCreateDiploma } from "@/features/diplomas/hooks/use-create-diploma";
import { useUpdateDiploma } from "@/features/diplomas/hooks/use-update-diploma";
import { getClientUploadFile } from "@/shared/lib/apis/upload.api";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface AdminDiplomaFormProps {
  initialDiploma?: IDiploma;
  isEditing?: boolean;
}

export function AdminDiplomaForm({
  initialDiploma,
  isEditing = false,
}: AdminDiplomaFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploading state & image preview
  const [imagePreview, setImagePreview] = useState<string>(
  initialDiploma?.image || "",
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mutation hooks
  const createMutation = useCreateDiploma();
  const updateMutation = useUpdateDiploma();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError =
  createMutation.error?.message || updateMutation.error?.message;

  // React Hook Form
  const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
  } = useForm<DiplomaFormValues>({
  resolver: zodResolver(diplomaFormSchema),
  defaultValues: {
  title: initialDiploma?.title || "",
  description: initialDiploma?.description || "",
  image: initialDiploma?.image || "",
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
  setImagePreview(initialDiploma?.image || "");
  setValue("image", initialDiploma?.image || "");
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

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  const file = e.dataTransfer.files?.[0];
  if (file) {
  handleUploadFile(file);
  }
  };

  const handleRemoveImage = () => {
  setImagePreview("");
  setValue("image", "", { shouldValidate: true });
  if (fileInputRef.current) {
  fileInputRef.current.value = "";
  }
  };

  // Submit Handler
  const onSubmit = (values: DiplomaFormValues) => {
  if (isEditing && initialDiploma) {
  updateMutation.mutate({
  id: initialDiploma.id,
  payload: values,
  });
  } else {
  createMutation.mutate(values);
  }
  };

  const pageTitle = isEditing ? "Edit Diploma" : "Add New Diploma";

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  {/* Top Header Row: Breadcrumb on left, Cancel & Save buttons on right (matching screenshot) */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  {/* Breadcrumb Navigation */}
  <nav
  aria-label="Breadcrumb"
  className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground"
  >
  <Link
  href={ROUTES.ADMIN.DIPLOMAS}
  className="hover:text-primary transition-colors hover:underline"
  >
  Diplomas
  </Link>
  <ChevronRight className="size-3 text-slate-400" />
  <span className="text-primary font-semibold">{pageTitle}</span>
  </nav>

  {/* Action Buttons: Cancel & Save */}
  <div className="flex items-center gap-2.5">
  {/* Cancel Button */}
  <Link
  href={ROUTES.ADMIN.DIPLOMAS}
  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-medium transition-colors cursor-pointer"
  >
  <X className="size-3.5" />
  <span>Cancel</span>
  </Link>

  {/* Save Button */}
  <button
  type="submit"
  disabled={isSubmitting || isUploadingImage}
  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#00B074] hover:bg-[#009E68] text-white font-mono text-xs font-medium shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50 select-none"
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
  <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
  {submitError}
  </div>
  )}

  {/* Main Card Container */}
  <div className="overflow-hidden border border-border/80 shadow-xs bg-white">
  {/* Blue Header Banner (matching screenshot) */}
  <div className="bg-primary text-white font-mono font-semibold text-xs sm:text-sm px-4 py-3">
  Diploma Information
  </div>

  {/* Form Body */}
  <div className="p-5 sm:p-6 space-y-6">
  {/* 1. Image Upload Dropzone */}
  <div>
  <label className="text-xs font-mono font-semibold text-slate-700 block mb-2">
  Image
  </label>

  {/* Hidden native input */}
  <input
  type="file"
  ref={fileInputRef}
  onChange={handleFileChange}
  accept="image/*"
  className="hidden"
  />

  {imagePreview ? (
  /* Display Uploaded Image Preview */
  <div className="relative border border-border/80 p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
  <div className="relative size-28 sm:size-32 overflow-hidden border border-border bg-white shadow-2xs shrink-0">
  <Image
  src={imagePreview}
  alt="Diploma preview"
  fill
  unoptimized
  className="object-cover"
  />
  {isUploadingImage && (
  <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center text-white">
  <Loader2 className="size-6 animate-spin" />
  </div>
  )}
  </div>

  <div className="flex-1 space-y-2 text-center sm:text-start">
  <p className="text-xs font-mono text-slate-600 font-medium">
  Image selected and uploaded successfully
  </p>
  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
  <button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  disabled={isUploadingImage}
  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-white text-xs font-mono hover:bg-slate-50 transition-colors cursor-pointer"
  >
  <RotateCcw className="size-3 text-slate-500" />
  <span>Change Image</span>
  </button>
  <button
  type="button"
  onClick={handleRemoveImage}
  disabled={isUploadingImage}
  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-red-50 text-red-600 text-xs font-mono hover:bg-red-100 transition-colors cursor-pointer"
  >
  <Trash2 className="size-3" />
  <span>Remove</span>
  </button>
  </div>
  </div>
  </div>
  ) : (
  /* Upload Placeholder Box (matching screenshot) */
  <div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={() => fileInputRef.current?.click()}
  className={`border border-dashed p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-center gap-4 cursor-pointer transition-colors ${
  isDragging
  ? "border-primary bg-primary/5"
  : "border-slate-300 bg-slate-50/40 hover:bg-slate-50"
  }`}
  >
  {/* Left outline icon */}
  <div className="size-10 sm:size-12 border border-slate-200 bg-white flex items-center justify-center text-slate-400 shrink-0">
  <FileImage className="size-6 stroke-1.5" />
  </div>

  {/* Center text with link */}
  <div className="text-center sm:text-start font-mono text-xs sm:text-sm text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-1">
  <UploadCloud className="size-4 text-slate-400 inline sm:hidden" />
  <span>Drop an image here or</span>
  <button
  type="button"
  className="text-primary hover:underline font-semibold cursor-pointer"
  >
  select from your computer
  </button>
  </div>
  </div>
  )}

  {/* Image Validation or Upload Error */}
  {uploadError && (
  <p className="text-xs text-destructive font-mono mt-1.5">
  {uploadError}
  </p>
  )}
  {!imagePreview && errors.image && (
  <p className="text-xs text-destructive font-mono mt-1.5">
  {errors.image.message}
  </p>
  )}
  </div>

  {/* 2. Title Input Field */}
  <div>
  <label
  htmlFor="diploma-title"
  className="text-xs font-mono font-semibold text-slate-700 block mb-2"
  >
  Title
  </label>
  <input
  id="diploma-title"
  type="text"
  placeholder="e.g. Frontend Development"
  disabled={isSubmitting}
  {...register("title")}
  className={`w-full h-11 px-3.5 border bg-white text-xs sm:text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
  errors.title
  ? "border-destructive focus:border-destructive"
  : "border-border/80 focus:border-primary"
  }`}
  />
  {errors.title && (
  <p className="text-xs text-destructive font-mono mt-1.5">
  {errors.title.message}
  </p>
  )}
  </div>

  {/* 3. Description Textarea Field */}
  <div>
  <label
  htmlFor="diploma-description"
  className="text-xs font-mono font-semibold text-slate-700 block mb-2"
  >
  Description
  </label>
  <textarea
  id="diploma-description"
  rows={5}
  placeholder="Enter comprehensive diploma description..."
  disabled={isSubmitting}
  {...register("description")}
  className={`w-full p-3.5 border bg-white text-xs sm:text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y min-h-32 ${
  errors.description
  ? "border-destructive focus:border-destructive"
  : "border-border/80 focus:border-primary"
  }`}
  />
  {errors.description && (
  <p className="text-xs text-destructive font-mono mt-1.5">
  {errors.description.message}
  </p>
  )}
  </div>
  </div>
  </div>
  </form>
  );
}

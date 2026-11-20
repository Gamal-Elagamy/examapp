"use client";

import Image from "next/image";
import Link from "next/link";
import { Ban, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/routes";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface AdminDiplomaViewProps {
  diploma: IDiploma;
}

export function AdminDiplomaView({ diploma }: AdminDiplomaViewProps) {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Link
          href={ROUTES.ADMIN.DIPLOMAS}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Diplomas
        </Link>
        <span>/</span>
        <span className="text-primary font-semibold truncate max-w-64">
          {diploma.title}
        </span>
      </nav>

      {/* Header Row: Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
          {diploma.title}
        </h1>

        <div className="flex items-center gap-3 select-none flex-wrap">
          {/* Immutable Badge */}
          {diploma.immutable && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 text-xs font-mono font-medium shadow-2xs">
              <Ban className="size-3.5 text-slate-500" />
              <span>Immutable</span>
            </div>
          )}

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => alert(`Edit ${diploma.title} will be connected in next step.`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => alert(`Delete ${diploma.title} will be connected in next step.`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Details Card (matching screenshot) */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
        {/* Section 1: Image */}
        <div className="space-y-2">
          <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Image
          </span>
          <div className="w-72 sm:w-80 aspect-square rounded-xl bg-slate-100 border border-border/60 overflow-hidden relative shadow-xs flex items-center justify-center">
            {diploma.image ? (
              <Image
                src={diploma.image}
                alt={diploma.title}
                width={320}
                height={320}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground font-mono">No Image</span>
            )}
          </div>
        </div>

        {/* Section 2: Title */}
        <div className="space-y-1.5 pt-2">
          <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Title
          </span>
          <p className="text-sm sm:text-base font-bold text-foreground font-mono">
            {diploma.title}
          </p>
        </div>

        {/* Section 3: Description */}
        <div className="space-y-1.5 pt-2">
          <span className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Description
          </span>
          <p className="text-xs sm:text-sm text-foreground/80 font-mono leading-relaxed max-w-3xl">
            {diploma.description}
          </p>
        </div>
      </div>

      {/* Back Link */}
      <div className="pt-2">
        <Link
          href={ROUTES.ADMIN.DIPLOMAS}
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Diplomas</span>
        </Link>
      </div>
    </div>
  );
}

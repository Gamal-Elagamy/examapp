"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpCircle, Clock, ArrowRight, BookOpen } from "lucide-react";
import type { IExam } from "@/shared/lib/types/exam";

interface ExamCardProps {
  exam: IExam;
}

function TechIcon({ title, image }: { title: string; image?: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={title}
        width={48}
        height={48}
        className="size-10 sm:size-12 object-contain"
      />
    );
  }

  const lower = title.toLowerCase();

  // HTML5 Shield
  if (lower.includes("html")) {
    return (
      <svg className="size-9 sm:size-10" viewBox="0 0 32 32" fill="none" aria-label="HTML5">
        <path d="M5 28L2 4h28l-3 24-11 3-11-3z" fill="#E44D26" />
        <path d="M16 28.5l9-2.5 2.5-20H16v22.5z" fill="#F16529" />
        <path d="M16 11.5H10l.5 4H16v-4zm0 8.5l-.2.1-3.3-.9-.2-2.7H8.5l.4 4.5 7.1 2V20z" fill="#EBEBEB" />
        <path d="M16 11.5v4h5.5l-.5 4.5-5 1.5v3.8l7.1-2 .9-7.8H16z" fill="#FFFFFF" />
      </svg>
    );
  }

  // CSS3 Shield
  if (lower.includes("css")) {
    return (
      <svg className="size-9 sm:size-10" viewBox="0 0 32 32" fill="none" aria-label="CSS3">
        <path d="M5 28L2 4h28l-3 24-11 3-11-3z" fill="#1572B6" />
        <path d="M16 28.5l9-2.5 2.5-20H16v22.5z" fill="#33A9DC" />
        <path d="M16 11.5H9.8l.4 4.5H16v-4.5zm0 8.5l-3.3-.9-.2-2.6H8.6l.4 4.5 7 2V20z" fill="#EBEBEB" />
        <path d="M16 11.5v4.5h5.3l-.5 5-4.8 1.4v3.8l7.1-2 .9-8.7H16z" fill="#FFFFFF" />
      </svg>
    );
  }

  // JavaScript Badge
  if (lower.includes("javascript") || lower.includes("js")) {
    return (
      <div className="size-10 sm:size-11 bg-[#f7df1e] text-[#000000] font-black flex items-end justify-end p-1 rounded-sm text-sm font-sans tracking-tight select-none shadow-xs">
        JS
      </div>
    );
  }

  // React Atom
  if (lower.includes("react")) {
    return (
      <svg className="size-9 sm:size-10" viewBox="-11.5 -10.23174 23 20.46348" aria-label="React">
        <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
        <g stroke="#00d8ff" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Angular Shield
  if (lower.includes("angular")) {
    return (
      <svg className="size-9 sm:size-10" viewBox="0 0 250 250" fill="none" aria-label="Angular">
        <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" fill="#DD0031" />
        <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 203.9,186.3 218.1,63.2" fill="#C3002F" />
        <path d="M125,52.1L66.8,182.6H91l11.9-29.8h44.2l11.9,29.8h24.2L125,52.1z M141.2,133.4h-32.4l16.2-40.3L141.2,133.4z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Vue Logo
  if (lower.includes("vue")) {
    return (
      <svg className="size-9 sm:size-10" viewBox="0 0 261.76 226.69" aria-label="Vue">
        <polygon points="161.096,0 130.88,52.344 100.664,0 0,0 130.88,226.69 261.76,0" fill="#42b883" />
        <polygon points="161.096,0 130.88,52.344 100.664,0 52.344,0 130.88,135.9 209.416,0" fill="#35495e" />
      </svg>
    );
  }

  return <BookOpen className="size-8 text-primary" />;
}

export function ExamCard({ exam }: ExamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const questionsCount =
    exam.numberOfQuestions ??
    (exam as { questionsCount?: number }).questionsCount ??
    0;
  const duration = exam.duration ?? 0;

  const isLongDescription = exam.description && exam.description.length > 180;

  return (
    <div
      style={{ backgroundColor: "rgba(239, 246, 255, 1)" }}
      className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 rounded-xl border border-brand-blue-200/60 hover:border-primary bg-brand-blue-50 p-5 shadow-2xs hover:shadow-md transition-all duration-200 group"
    >
      {/* Tech Icon Box: background rgba(219, 234, 254, 1), border 1px solid rgba(142, 197, 255, 1) */}
      <div
        style={{
          backgroundColor: "rgba(219, 234, 254, 1)",
          borderColor: "rgba(142, 197, 255, 1)",
        }}
        className="size-16 sm:size-20 rounded-xl bg-brand-blue-100 border border-brand-blue-300 flex items-center justify-center p-3 shrink-0"
      >
        <TechIcon title={exam.title} image={exam.image} />
      </div>

      {/* Main Details */}
      <div className="flex-1 w-full space-y-2">
        {/* Top Header Row: Title & Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">
            {exam.title}
          </h3>

          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="size-3.5 text-muted-foreground" />
              <span>{questionsCount} Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground" />
              <span>{duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Description with See More Toggle */}
        <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed pe-0 sm:pe-24">
          <p className={!isExpanded && isLongDescription ? "line-clamp-2" : ""}>
            {exam.description}
          </p>
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="text-xs font-semibold text-foreground hover:text-primary transition-colors mt-1 cursor-pointer"
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>

      {/* Hover Action Button (START ->) on Bottom-Right */}
      <div className="w-full sm:w-auto flex justify-end sm:absolute sm:bottom-5 sm:inset-e-5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 sm:translate-y-1 sm:group-hover:translate-y-0">
        <Link
          href={`/exams/${exam.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
        >
          <span>START</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, Search, ChevronDown, ChevronUp } from "lucide-react";
import { getClientDiplomas } from "@/features/diplomas/lib/apis/diplomas.api";
import { diplomaKeys } from "@/features/diplomas/lib/apis/diplomas.key";

interface AdminExamsFilterProps {
  initialSearch?: string;
  initialDiploma?: string;
  initialImmutable?: boolean;
  onApply: (search: string, diploma: string | undefined, immutable: boolean | undefined) => void;
  onClear: () => void;
}

export function AdminExamsFilter({
  initialSearch = "",
  initialDiploma,
  initialImmutable,
  onApply,
  onClear,
}: AdminExamsFilterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDiploma, setSelectedDiploma] = useState<string>(initialDiploma || "");
  const [immutableValue, setImmutableValue] = useState<string>(
    initialImmutable === true
      ? "immutable"
      : initialImmutable === false
      ? "mutable"
      : "none",
  );

  // Fetch Diplomas list for the Diploma dropdown
  const { data: diplomasData } = useQuery({
    queryKey: diplomaKeys.list({ limit: 100 }),
    queryFn: () => getClientDiplomas({ limit: 100 }),
  });

  const diplomas = diplomasData?.data || [];

  const handleApply = (e?: React.FormEvent) => {
    e?.preventDefault();
    const immutableParam =
      immutableValue === "immutable"
        ? true
        : immutableValue === "mutable"
        ? false
        : undefined;

    const diplomaParam = selectedDiploma || undefined;

    onApply(searchTerm, diplomaParam, immutableParam);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedDiploma("");
    setImmutableValue("none");
    onClear();
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white shadow-2xs overflow-hidden">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-primary text-white px-4 py-3 sm:px-6 flex items-center justify-between font-mono text-xs sm:text-sm font-semibold select-none cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          <span>Search &amp; Filters</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white">
          <span>{isOpen ? "Hide" : "Show"}</span>
          {isOpen ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </div>
      </button>

      {/* Filter Body */}
      {isOpen && (
        <form onSubmit={handleApply} className="p-4 sm:p-6 space-y-4 font-mono">
          {/* Row 1: Search by title */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title"
              className="w-full h-11 px-4 pe-10 rounded-lg border border-border/80 bg-white text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            <Search className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Row 2: Diploma & Immutability Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Diploma Select */}
            <div className="relative">
              <select
                value={selectedDiploma}
                onChange={(e) => setSelectedDiploma(e.target.value)}
                className="w-full h-11 px-4 pe-10 rounded-lg border border-border/80 bg-white text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">Diploma (All)</option>
                {diplomas.map((dip) => (
                  <option key={dip.id} value={dip.id}>
                    {dip.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Immutability Select */}
            <div className="relative">
              <select
                value={immutableValue}
                onChange={(e) => setImmutableValue(e.target.value)}
                className="w-full h-11 px-4 pe-10 rounded-lg border border-border/80 bg-white text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="none">Immutability (None)</option>
                <option value="immutable">Immutable</option>
                <option value="mutable">Mutable</option>
              </select>
              <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Bottom Actions: Clear & Apply */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Clear
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer select-none"
            >
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

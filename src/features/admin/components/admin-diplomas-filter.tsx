"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronsUpDown, Search, ChevronUp, ChevronDown } from "lucide-react";

interface AdminDiplomasFilterProps {
  initialSearch?: string;
  initialImmutable?: boolean;
  onApply: (search: string, immutable: boolean | undefined) => void;
  onClear: () => void;
}

export function AdminDiplomasFilter({
  initialSearch = "",
  initialImmutable,
  onApply,
  onClear,
}: AdminDiplomasFilterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [immutableValue, setImmutableValue] = useState<"none" | "true" | "false">(
    initialImmutable === true ? "true" : initialImmutable === false ? "false" : "none",
  );

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const immutable =
      immutableValue === "true" ? true : immutableValue === "false" ? false : undefined;
    onApply(searchTerm, immutable);
  };

  const handleClear = () => {
    setSearchTerm("");
    setImmutableValue("none");
    onClear();
  };

  return (
    <div className="rounded-lg border border-border/80 shadow-2xs overflow-hidden">
      {/* Blue Header Bar with Toggle */}
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
          <SlidersHorizontal className="size-4" />
          <span>Search & Filters</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-opacity font-mono cursor-pointer"
        >
          {isOpen ? (
            <>
              <ChevronUp className="size-3.5" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <ChevronDown className="size-3.5" />
              <span>Show</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Body (Collapsible) */}
      {isOpen && (
        <form onSubmit={handleApply} className="bg-white p-5 space-y-4">
          {/* Search by Title Field */}
          <div className="relative">
            <input
              id="search-diploma-title"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title"
              aria-label="Search by title"
              className="w-full px-4 py-2.5 pe-10 rounded-lg border border-border bg-white text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Search className="size-4" />
            </button>
          </div>

          {/* Immutability Dropdown Select: [None, Immutable, Mutable] */}
          <div className="relative">
            <select
              id="filter-diploma-immutability"
              value={immutableValue}
              onChange={(e) => setImmutableValue(e.target.value as "none" | "true" | "false")}
              aria-label="Filter by immutability"
              className="w-full appearance-none px-4 py-2.5 pe-10 rounded-lg border border-border bg-white text-xs sm:text-sm font-mono text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
            >
              <option value="none">None</option>
              <option value="true">Immutable</option>
              <option value="false">Mutable</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 inset-e-0 pe-3 flex items-center text-muted-foreground">
              <ChevronsUpDown className="size-4" />
            </div>
          </div>

          {/* Action Buttons: Clear & Apply */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-2 rounded-md text-xs sm:text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors cursor-pointer select-none"
            >
              Clear
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-mono font-medium shadow-2xs transition-colors cursor-pointer select-none"
            >
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

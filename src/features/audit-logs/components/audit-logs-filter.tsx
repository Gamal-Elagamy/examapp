"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import type { IAdminUser } from "../lib/types/audit-log";

interface AuditLogsFilterProps {
  category?: string;
  action?: string;
  actorUserId?: string;
  users?: IAdminUser[];
  onApply: (filters: {
    category?: string;
    action?: string;
    actorUserId?: string;
  }) => void;
  onClear: () => void;
}

export function AuditLogsFilter({
  category = "",
  action = "",
  actorUserId = "",
  users = [],
  onApply,
  onClear,
}: AuditLogsFilterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedAction, setSelectedAction] = useState(action);
  const [selectedActorUserId, setSelectedActorUserId] = useState(actorUserId);

  const handleApply = () => {
    onApply({
      category: selectedCategory || undefined,
      action: selectedAction || undefined,
      actorUserId: selectedActorUserId || undefined,
    });
  };

  const handleClear = () => {
    setSelectedCategory("");
    setSelectedAction("");
    setSelectedActorUserId("");
    onClear();
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white shadow-xs overflow-hidden font-mono">
      {/* Blue Header Bar */}
      <div className="bg-blue-600 px-6 py-3.5 flex items-center justify-between text-white select-none">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wide">
          <SlidersHorizontal className="size-4" />
          <span>Search & Filters</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs hover:text-white/80 transition-colors flex items-center gap-1 cursor-pointer font-medium"
        >
          <span>{isOpen ? "Hide" : "Show"}</span>
          {isOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>

      {/* Filter Body */}
      {isOpen && (
        <div className="p-6 space-y-5 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                aria-label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border/80 bg-slate-50/60 px-4 py-2.5 text-xs sm:text-sm font-mono text-foreground focus:bg-white focus:border-primary focus:outline-hidden transition-colors cursor-pointer"
              >
                <option value="">Category</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="EXAM">Exam</option>
                <option value="QUESTION">Question</option>
                <option value="AUTH">Auth</option>
                <option value="USER">User</option>
              </select>
              <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Action Dropdown */}
            <div className="relative">
              <select
                aria-label="Action"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border/80 bg-slate-50/60 px-4 py-2.5 text-xs sm:text-sm font-mono text-foreground focus:bg-white focus:border-primary focus:outline-hidden transition-colors cursor-pointer"
              >
                <option value="">Action</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
              <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <select
                aria-label="User"
                value={selectedActorUserId}
                onChange={(e) => setSelectedActorUserId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border/80 bg-slate-50/60 px-4 py-2.5 text-xs sm:text-sm font-mono text-foreground focus:bg-white focus:border-primary focus:outline-hidden transition-colors cursor-pointer"
              >
                <option value="">User</option>
                {users.map((u) => {
                  const label =
                    u.firstName && u.firstName !== u.username
                      ? `${u.firstName} ${u.lastName || ""} (${u.username || u.email})`
                      : u.username
                        ? `${u.username}${u.email ? ` (${u.email})` : ""}`
                        : u.email;
                  return (
                    <option key={u.id} value={u.id}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Bottom Actions: Clear & Apply */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-600 hover:text-foreground font-mono font-medium px-4 py-2 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-border/80 text-foreground font-mono text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

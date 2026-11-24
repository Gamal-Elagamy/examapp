"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import type { IAuditLog } from "../lib/types/audit-log";

interface AuditLogsTableProps {
  logs: IAuditLog[];
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onView?: (log: IAuditLog) => void;
  onDelete: (log: IAuditLog) => void;
}

export function AuditLogsTable({
  logs,
  isLoading = false,
  sortBy = "createdAt",
  sortOrder = "desc",
  onSortChange,
  onView,
  onDelete,
}: AuditLogsTableProps) {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === USER_ROLES.SUPER_ADMIN;

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
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

  const sortOptions = [
    { label: "Action (descending)", by: "action", order: "desc" as const },
    { label: "Action (ascending)", by: "action", order: "asc" as const },
    { label: "User (descending)", by: "user", order: "desc" as const },
    { label: "User (ascending)", by: "user", order: "asc" as const },
    { label: "Entity (descending)", by: "entity", order: "desc" as const },
    { label: "Entity (ascending)", by: "entity", order: "asc" as const },
    { label: "Newest (descending)", by: "createdAt", order: "desc" as const },
    { label: "Newest (ascending)", by: "createdAt", order: "asc" as const },
  ];

  // Helper to format date
  const formatLogDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      const timeStr = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const dateStr = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      return { time: timeStr, date: dateStr };
    } catch {
      return { time: dateString, date: "" };
    }
  };

  // Helper for entity link - navigates to the actual entity (diploma, exam)
  const getEntityLink = (log: IAuditLog) => {
    // If the entity was deleted in this action, it no longer exists
    if (log.action === "DELETE") return null;

    const type = (log.entityType || "").toLowerCase();
    if (type === "diploma") return ROUTES.ADMIN.DIPLOMA_DETAILS(log.entityId);
    if (type === "exam") return ROUTES.ADMIN.EXAM_DETAILS(log.entityId);
    if (type === "question") {
      const examId =
        (log.metadata as { examId?: string })?.examId ||
        (log.entityType === "question" && log.path?.includes("/exam/")
          ? log.entityId
          : undefined);
      if (examId) return ROUTES.ADMIN.EXAM_DETAILS(examId);
      return ROUTES.ADMIN.EXAM_DETAILS(log.entityId);
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-xs font-mono">
      {/* Table Blue Header */}
      <div className="bg-blue-600 px-6 py-3.5 flex items-center justify-between text-white select-none text-xs font-bold">
        <div className="grid grid-cols-12 gap-4 flex-1 items-center">
          <span className="col-span-2">Action</span>
          <span className="col-span-4">User</span>
          <span className="col-span-3">Entity</span>
          <span className="col-span-3">Time</span>
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0 ms-4" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer text-xs font-bold"
          >
            <span>Sort</span>
            <ArrowUpDown className="size-3.5" />
          </button>

          {isSortOpen && (
            <div className="absolute inset-e-0 top-full mt-2 w-52 rounded-xl border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 text-slate-700 divide-y divide-border/60">
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt.by && sortOrder === opt.order;
                return (
                  <button
                    key={`${opt.by}-${opt.order}`}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.by, opt.order);
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <span className="text-primary">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rows Container */}
      <div className="divide-y divide-border/60">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-center justify-between animate-pulse"
            >
              <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                <div className="col-span-2 space-y-1.5">
                  <div className="h-3.5 w-16 bg-slate-200 rounded" />
                  <div className="h-2.5 w-20 bg-slate-100 rounded" />
                </div>
                <div className="col-span-4 space-y-1.5">
                  <div className="h-3.5 w-32 bg-slate-200 rounded" />
                  <div className="h-2.5 w-40 bg-slate-100 rounded" />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <div className="h-3.5 w-24 bg-slate-200 rounded" />
                  <div className="h-2.5 w-32 bg-slate-100 rounded" />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <div className="h-3.5 w-20 bg-slate-200 rounded" />
                  <div className="h-2.5 w-28 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="size-8 rounded-lg bg-slate-100 ms-4" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs sm:text-sm font-mono">
            No audit logs found.
          </div>
        ) : (
          logs.map((log) => {
            const isMenuOpen = activeMenuId === log.id;
            const { time, date } = formatLogDate(log.createdAt);
            const entityLink = getEntityLink(log);

            const isCreate = log.action === "CREATE";
            const isDelete = log.action === "DELETE";

            return (
              <div
                key={log.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors group relative"
              >
                <div className="grid grid-cols-12 gap-4 flex-1 items-center min-w-0">
                  {/* Action Column */}
                  <div className="col-span-2">
                    <p
                      className={`text-xs font-bold tracking-tight ${
                        isCreate
                          ? "text-[#22AD5C]"
                          : isDelete
                            ? "text-[#F23030]"
                            : "text-[#E59819]"
                      }`}
                    >
                      {log.action}
                    </p>
                    <p className="text-[11px] text-[#8A99AD] mt-0.5">
                      Method: {log.httpMethod}
                    </p>
                  </div>

                  {/* User Column */}
                  <div className="col-span-4 min-w-0 pr-2">
                    <p className="text-xs font-bold text-[#1C2434] truncate">
                      {log.actorUsername}
                    </p>
                    <p className="text-[11px] text-[#8A99AD] truncate">
                      {log.actorEmail}
                    </p>
                    <p
                      className={`text-[11px] font-bold mt-0.5 ${
                        log.actorRole === "SUPER_ADMIN"
                          ? "text-[#F23030]"
                          : "text-[#2563EB]"
                      }`}
                    >
                      {log.actorRole === "SUPER_ADMIN"
                        ? "Super Admin"
                        : log.actorRole === "ADMIN"
                          ? "Admin"
                          : log.actorRole}
                    </p>
                  </div>

                  {/* Entity Column */}
                  <div className="col-span-3 min-w-0 pr-2">
                    <p className="text-xs font-bold text-[#1C2434] capitalize">
                      {log.entityType}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-[#8A99AD]">
                      <span className="truncate">{log.entityId}</span>
                      {entityLink && (
                        <Link
                          href={entityLink}
                          className="text-[#8A99AD] hover:text-primary shrink-0"
                          title="View Entity"
                        >
                          <ExternalLink className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Time Column */}
                  <div className="col-span-3">
                    <p className="text-xs text-[#1C2434] font-semibold">
                      {time}
                    </p>
                    <p className="text-[11px] text-[#8A99AD] mt-0.5">
                      {date}
                    </p>
                  </div>
                </div>

                {/* Actions Dropdown (...) */}
                <div
                  className="relative shrink-0 ms-4"
                  ref={isMenuOpen ? menuRef : undefined}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId(isMenuOpen ? null : log.id)
                    }
                    aria-label="Actions"
                    className="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute inset-e-0 top-full mt-1.5 w-32 rounded-xl border border-border bg-white p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 font-mono">
                      {/* View Action - Opens Audit Log - View page */}
                      <Link
                        href={ROUTES.ADMIN.AUDIT_LOG_DETAILS(log.id)}
                        onClick={() => {
                          setActiveMenuId(null);
                          onView?.(log);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[#22AD5C] hover:bg-emerald-50 transition-colors font-medium cursor-pointer"
                      >
                        <Eye className="size-3.5 text-[#22AD5C]" />
                        <span>View</span>
                      </Link>

                      {/* Delete Action (Super Admins only) */}
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDelete(log);
                          }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[#F23030] hover:bg-red-50 transition-colors font-medium cursor-pointer"
                        >
                          <Trash2 className="size-3.5 text-[#F23030]" />
                          <span>Delete</span>
                        </button>
                      )}
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { useAuditLogDetails } from "../hooks/use-audit-log-details";
import { DeleteAuditLogDialog } from "../components/delete-audit-log-dialog";
import type { IAuditLog } from "../lib/types/audit-log";

interface AuditLogDetailsRouteProps {
  id: string;
  initialData?: IAuditLog;
}

export function AuditLogDetailsRoute({
  id,
  initialData,
}: AuditLogDetailsRouteProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === USER_ROLES.SUPER_ADMIN;

  const { data: log, isLoading } = useAuditLogDetails(id, initialData);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading && !log) {
  return (
  <div className="py-12 flex justify-center items-center">
  <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent" />
  </div>
  );
  }

  if (!log) {
  return (
  <div className="py-12 text-center text-muted-foreground text-xs sm:text-sm font-mono">
  Audit log not found.
  </div>
  );
  }

  // Format date & time: "7:50:00 PM | Sat, April 11, 2025"
  const formatDateTime = (dateString: string) => {
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
  return `${timeStr} | ${dateStr}`;
  } catch {
  return dateString;
  }
  };

  // Capitalize helper
  const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const entityTypeCap = capitalize(log.entityType || "Entity");
  const actionCap = capitalize(log.action || "Action");
  const headingTitle = `${entityTypeCap} ${actionCap} By ${log.actorUsername}`;

  // Entity link helper
  const getEntityLink = () => {
  // If the entity was deleted in this action, it no longer exists
  if (log.action === "DELETE") return null;

  const type = (log.entityType || "").toLowerCase();
  if (type === "diploma") return ROUTES.ADMIN.DIPLOMA_DETAILS(log.entityId);
  if (type === "exam") return ROUTES.ADMIN.EXAM_DETAILS(log.entityId);
  if (type === "question") {
  const examId =
  (log.metadata as { examId?: string })?.examId ||
  (log.path?.match(/\/exams?\/([a-zA-Z0-9]+)/)?.[1]);
  if (examId) return ROUTES.ADMIN.QUESTION_DETAILS(examId, log.entityId);
  return null;
  }
  return null;
  };

  const entityLink = getEntityLink();

  const isCreate = log.action === "CREATE";
  const isDelete = log.action === "DELETE";

  // Check updated fields in metadata if present
  const updatedFields =
  (log.metadata as { updatedFields?: string[] })?.updatedFields?.join(", ") ||
  ((log.metadata as { textChanged?: boolean })?.textChanged
  ? "text, answers"
  : log.action === "UPDATE" && log.metadata && typeof log.metadata === "object"
  ? Object.keys(log.metadata).filter((k) => k !== "updatedFields" && k !== "textChanged").join(", ")
  : null);

  // Format metadata JSON without enclosing outer braces to match design
  const formatMetadata = (data: unknown) => {
  if (!data || typeof data !== "object") return "";
  const raw = JSON.stringify(data, null, 2);
  const lines = raw.split("\n");
  if (lines.length > 2 && lines[0]?.trim() === "{" && lines[lines.length - 1]?.trim() === "}") {
  return lines.slice(1, -1).map((l) => l.replace(/^ {2}/, "")).join("\n");
  }
  return raw;
  };

  return (
  <div className="space-y-6 max-w-7xl font-mono">
  {/* Top Breadcrumbs */}
  <div className="flex items-center gap-2 text-xs text-muted-foreground select-none flex-wrap">
  <Link
  href={ROUTES.ADMIN.AUDIT_LOG}
  className="hover:text-foreground transition-colors flex items-center gap-1"
  >
  <ArrowLeft className="size-3" />
  <span>Audit Log</span>
  </Link>
  <span>/</span>
  <span className="text-[#2563EB] font-semibold">{headingTitle}</span>
  </div>

  {/* Top Header Row */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div>
  <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
  {headingTitle}
  </h1>
  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
  <span>Entity:</span>
  {entityLink ? (
  <Link
  href={entityLink}
  className="text-foreground hover:text-primary transition-colors flex items-center gap-1"
  >
  <span>
  {entityTypeCap} [{log.entityId}]
  </span>
  <ExternalLink className="size-3" />
  </Link>
  ) : (
  <span>
  {entityTypeCap} [{log.entityId}]
  </span>
  )}
  </div>
  </div>

  {/* Delete Button (Only visible to super admins) */}
  {isSuperAdmin && (
  <button
  type="button"
  onClick={() => setIsDeleteOpen(true)}
  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold shadow-xs hover:shadow-sm transition-colors cursor-pointer select-none"
  >
  <Trash2 className="size-3.5" />
  <span>Delete</span>
  </button>
  )}
  </div>

  {/* Details Card */}
  <div className="border border-border/80 bg-white shadow-xs p-6 sm:p-8 space-y-6">
  {/* Action */}
  <div>
  <h4 className="text-xs text-muted-foreground font-medium mb-1">
  Action
  </h4>
  <p
  className={`text-xs sm:text-sm font-bold tracking-tight ${
  isCreate
  ? "text-[#22AD5C]"
  : isDelete
  ? "text-[#F23030]"
  : "text-[#E59819]"
  }`}
  >
  {log.action}
  </p>
  </div>

  {/* Method */}
  <div>
  <h4 className="text-xs text-muted-foreground font-medium mb-1">
  Method
  </h4>
  <p className="text-xs sm:text-sm font-bold text-foreground">
  {log.httpMethod || "POST"}
  </p>
  </div>

  {/* User */}
  <div>
  <h4 className="text-xs text-muted-foreground font-medium mb-1">
  User
  </h4>
  <p className="text-xs sm:text-sm font-bold text-[#1C2434]">
  {log.actorUsername}
  </p>
  <p className="text-xs text-[#8A99AD] mt-0.5">
  Email: {log.actorEmail}
  </p>
  {log.ipAddress && (
  <p className="text-xs text-[#8A99AD] mt-0.5">
  IP Address: {log.ipAddress}
  </p>
  )}
  <p
  className={`text-xs font-bold mt-1 ${
  log.actorRole === "SUPER_ADMIN"
  ? "text-[#F23030]"
  : "text-[#2563EB]"
  }`}
  >
  Role:{" "}
  {log.actorRole === "SUPER_ADMIN"
  ? "Super Admin"
  : log.actorRole === "ADMIN"
  ? "Admin"
  : log.actorRole}
  </p>
  </div>

  {/* Entity */}
  <div>
  <h4 className="text-xs text-muted-foreground font-medium mb-1">
  Entity
  </h4>
  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1C2434]">
  <span>
  {entityTypeCap}: {log.entityId}
  </span>
  {entityLink && (
  <Link
  href={entityLink}
  className="text-[#8A99AD] hover:text-primary transition-colors"
  title="View Entity"
  >
  <ExternalLink className="size-3.5" />
  </Link>
  )}
  </div>
  </div>

  {/* Date & Time */}
  <div>
  <h4 className="text-xs text-muted-foreground font-medium mb-1">
  Date & Time
  </h4>
  <p className="text-xs sm:text-sm text-[#1C2434] font-semibold">
  {formatDateTime(log.createdAt)}
  </p>
  </div>

  {/* Updated Fields (if present) */}
  {updatedFields && (
  <div>
  <h4 className="text-xs text-muted-foreground font-medium mb-1">
  Updated Fields
  </h4>
  <p className="text-xs sm:text-sm text-[#1C2434] font-semibold">
  {updatedFields}
  </p>
  </div>
  )}

  {/* Metadata */}
  {log.metadata && Object.keys(log.metadata).length > 0 && (
  <div>
  <h4 className="text-xs text-muted-foreground font-medium mb-2">
  Metadata
  </h4>
  <pre className="border border-border/70 bg-slate-100/70 p-4 text-xs font-mono text-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
  {formatMetadata(log.metadata)}
  </pre>
  </div>
  )}
  </div>

  {/* Delete Dialog */}
  <DeleteAuditLogDialog
  isOpen={isDeleteOpen}
  log={log}
  onClose={() => setIsDeleteOpen(false)}
  onSuccess={() => {
  router.push(ROUTES.ADMIN.AUDIT_LOG);
  }}
  />
  </div>
  );
}

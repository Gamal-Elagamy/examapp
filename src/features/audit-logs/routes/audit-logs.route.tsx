"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { AuditLogsFilter } from "../components/audit-logs-filter";
import { AuditLogsTable } from "../components/audit-logs-table";
import { ClearAuditLogsDialog } from "../components/clear-audit-logs-dialog";
import { DeleteAuditLogDialog } from "../components/delete-audit-log-dialog";
import { useAuditLogs } from "../hooks/use-audit-logs";
import { useAdminUsers } from "../hooks/use-admin-users";
import type {
  IAuditLogsPayload,
  IAuditLog,
  GetAuditLogsParams,
  IAdminUser,
} from "../lib/types/audit-log";

interface AuditLogsRouteProps {
  initialData?: IAuditLogsPayload;
}

export function AuditLogsRoute({ initialData }: AuditLogsRouteProps) {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === USER_ROLES.SUPER_ADMIN;

  // Filter & Query params
  const [params, setParams] = useState<GetAuditLogsParams>({
  page: 1,
  limit: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
  });

  // Query hook
  const { data: auditLogsData, isFetching } = useAuditLogs(params, initialData);

  // Admin users for filter dropdown
  const { data: usersData } = useAdminUsers();

  // Merge users from admin users API with active actors from logs
  const userMap = new Map<string, IAdminUser>();

  // 1. Add active actors from loaded logs & initialData
  const allLogs = [...(initialData?.data || []), ...(auditLogsData?.data || [])];
  for (const log of allLogs) {
  if (log.actorUserId && !userMap.has(log.actorUserId)) {
  userMap.set(log.actorUserId, {
  id: log.actorUserId,
  username: log.actorUsername,
  email: log.actorEmail,
  firstName: log.actorUsername,
  role: log.actorRole,
  });
  }
  }

  // 2. Add users from admin users API if available (only ADMIN and SUPER_ADMIN)
  const isAdminOrSuperAdmin = (role?: string) =>
  role === USER_ROLES.ADMIN ||
  role === USER_ROLES.SUPER_ADMIN ||
  role?.toUpperCase() === "ADMIN" ||
  role?.toUpperCase() === "SUPER_ADMIN";

  const fetchedUsers = usersData?.data || [];
  for (const u of fetchedUsers) {
  if (u.id && !userMap.has(u.id) && isAdminOrSuperAdmin(u.role)) {
  userMap.set(u.id, u);
  }
  }

  const availableUsers = Array.from(userMap.values());

  // Dialog states
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<IAuditLog | null>(null);

  const logs = auditLogsData?.data || [];
  const metadata = auditLogsData?.metadata || {
  page: 1,
  limit: 20,
  total: logs.length,
  totalPages: 1,
  };

  const currentPage = metadata.page;
  const totalPages = Math.max(metadata.totalPages, 1);
  const totalItems = metadata.total;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * metadata.limit + 1;
  const endItem = Math.min(currentPage * metadata.limit, totalItems);

  // Pagination Handlers
  const handlePrevPage = () => {
  if (currentPage > 1) {
  setParams((prev) => ({ ...prev, page: currentPage - 1 }));
  }
  };

  const handleNextPage = () => {
  if (currentPage < totalPages) {
  setParams((prev) => ({ ...prev, page: currentPage + 1 }));
  }
  };

  // Filter Handlers
  const handleApplyFilters = (filters: {
  category?: string;
  action?: string;
  actorUserId?: string;
  }) => {
  setParams((prev) => ({
  ...prev,
  page: 1,
  ...filters,
  }));
  };

  const handleClearFilters = () => {
  setParams((prev) => ({
  ...prev,
  page: 1,
  category: undefined,
  action: undefined,
  actorUserId: undefined,
  }));
  };

  // Sort Handler
  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
  setParams((prev) => ({
  ...prev,
  sortBy,
  sortOrder,
  page: 1,
  }));
  };

  return (
  <div className="space-y-6 max-w-7xl font-mono">
  {/* Top Breadcrumb */}
  <div className="text-xs text-muted-foreground select-none">Audit Log</div>

  {/* Top Header Row */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  {/* Pagination & Counter Bar */}
  <div className="flex items-center gap-3 select-none flex-wrap">
  <span className="text-xs font-bold text-foreground">
  {startItem} - {endItem} of {totalItems}
  </span>

  <div className="flex items-center border border-border/80 bg-slate-50/80 overflow-hidden shadow-2xs">
  <button
  type="button"
  onClick={handlePrevPage}
  disabled={currentPage <= 1 || isFetching}
  aria-label="Previous page"
  className="px-2.5 py-1.5 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-r border-border/80"
  >
  <ChevronLeft className="size-3.5" />
  </button>

  <span className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white">
  Page {currentPage} of {totalPages}
  </span>

  <button
  type="button"
  onClick={handleNextPage}
  disabled={currentPage >= totalPages || isFetching}
  aria-label="Next page"
  className="px-2.5 py-1.5 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-l border-border/80"
  >
  <ChevronRight className="size-3.5" />
  </button>
  </div>

  {isFetching && (
  <Loader2 className="size-4 animate-spin text-muted-foreground" />
  )}
  </div>

  {/* Clear All Logs Button (Super Admins only) */}
  {isSuperAdmin && (
  <button
  type="button"
  onClick={() => setIsClearOpen(true)}
  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold shadow-xs hover:shadow-sm transition-colors cursor-pointer select-none"
  >
  <Trash2 className="size-3.5" />
  <span>Clear All Logs</span>
  </button>
  )}
  </div>

  {/* Search & Filters Card */}
  <AuditLogsFilter
  category={params.category}
  action={params.action}
  actorUserId={params.actorUserId}
  users={availableUsers}
  onApply={handleApplyFilters}
  onClear={handleClearFilters}
  />

  {/* Table Component */}
  <AuditLogsTable
  logs={logs}
  isLoading={isFetching}
  sortBy={params.sortBy}
  sortOrder={params.sortOrder}
  onSortChange={handleSortChange}
  onDelete={(log) => setLogToDelete(log)}
  />

  {/* Dialogs */}
  <ClearAuditLogsDialog
  isOpen={isClearOpen}
  onClose={() => setIsClearOpen(false)}
  />

  <DeleteAuditLogDialog
  isOpen={Boolean(logToDelete)}
  log={logToDelete}
  onClose={() => setLogToDelete(null)}
  />
  </div>
  );
}

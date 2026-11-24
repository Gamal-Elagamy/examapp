export type AuditLogAction = "CREATE" | "UPDATE" | "DELETE" | string;
export type AuditLogCategory = "DIPLOMA" | "EXAM" | "QUESTION" | string;

export interface IAuditLog {
  id: string;
  createdAt: string;
  actorUserId: string;
  actorUsername: string;
  actorEmail: string;
  actorRole: "ADMIN" | "SUPER_ADMIN" | "USER" | string;
  category: AuditLogCategory;
  action: AuditLogAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
  httpMethod: string;
  path: string;
}

export interface IAuditLogsPayload {
  data: IAuditLog[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAuditLogDetailsPayload {
  auditLog: IAuditLog;
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  category?: string;
  action?: string;
  actorUserId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IAdminUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminUsersPayload {
  data: IAdminUser[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import type { IApiResponse } from "@/shared/lib/types/api";
import type {
  IAuditLogsPayload,
  GetAuditLogsParams,
  IAdminUsersPayload,
  GetAdminUsersParams,
  IAuditLogDetailsPayload,
  IAuditLog,
} from "../types/audit-log";

export async function getAuditLogs(
  params?: GetAuditLogsParams,
  token?: string,
): Promise<IApiResponse<IAuditLogsPayload>> {
  const query = new URLSearchParams();
  query.set("page", (params?.page || 1).toString());
  query.set("limit", (params?.limit || 20).toString()); // 20 items per page!

  if (params?.category) query.set("category", params.category);
  if (params?.action) query.set("action", params.action);
  if (params?.actorUserId) query.set("actorUserId", params.actorUserId);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.search) query.set("search", params.search.trim());

  const queryString = query.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/audit-logs${queryString ? `?${queryString}` : ""}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const payload: IApiResponse<IAuditLogsPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch audit logs"));
  }

  return payload;
}

export async function getClientAuditLogs(
  params?: GetAuditLogsParams,
): Promise<IAuditLogsPayload> {
  const query = new URLSearchParams();
  query.set("page", (params?.page || 1).toString());
  query.set("limit", (params?.limit || 20).toString());

  if (params?.category) query.set("category", params.category);
  if (params?.action) query.set("action", params.action);
  if (params?.actorUserId) query.set("actorUserId", params.actorUserId);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.search) query.set("search", params.search.trim());

  const queryString = query.toString();
  const url = `/api/admin/audit-logs${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url);
  const data: IApiResponse<IAuditLogsPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch audit logs"));
  }

  return data.payload;
}

export async function clearAllAuditLogs(
  token?: string,
): Promise<IApiResponse<{ deletedCount: number }>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/audit-logs`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "DELETE",
    headers,
  });

  const payload: IApiResponse<{ deletedCount: number }> = await res
    .json()
    .catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to clear audit logs"));
  }

  return payload;
}

export async function getClientClearAllAuditLogs(): Promise<{ deletedCount: number }> {
  const url = `/api/admin/audit-logs`;
  const res = await fetch(url, { method: "DELETE" });
  const data: IApiResponse<{ deletedCount: number }> = await res
    .json()
    .catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to clear audit logs"));
  }

  return data.payload;
}

export async function deleteAuditLog(
  id: string,
  token?: string,
): Promise<IApiResponse<null>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/audit-logs/${id}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "DELETE",
    headers,
  });

  const payload: IApiResponse<null> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to delete audit log"));
  }

  return payload;
}

export async function getClientDeleteAuditLog(id: string): Promise<void> {
  const url = `/api/admin/audit-logs/${id}`;
  const res = await fetch(url, { method: "DELETE" });
  const data: IApiResponse<null> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status) {
    throw new Error(extractErrorMessage(data, "Failed to delete audit log"));
  }
}

export async function getAuditLogById(
  id: string,
  token?: string,
): Promise<IApiResponse<IAuditLogDetailsPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/audit-logs/${id}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const payload: IApiResponse<IAuditLogDetailsPayload> = await res
    .json()
    .catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(
      extractErrorMessage(payload, "Failed to fetch audit log details"),
    );
  }

  return payload;
}

export async function getClientAuditLogById(id: string): Promise<IAuditLog> {
  const url = `/api/admin/audit-logs/${id}`;
  const res = await fetch(url);
  const data: IApiResponse<IAuditLogDetailsPayload> = await res
    .json()
    .catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload?.auditLog) {
    throw new Error(
      extractErrorMessage(data, "Failed to fetch audit log details"),
    );
  }

  return data.payload.auditLog;
}

export async function getAdminUsers(
  params?: GetAdminUsersParams,
  token?: string,
): Promise<IApiResponse<IAdminUsersPayload>> {
  const query = new URLSearchParams();
  query.set("page", (params?.page || 1).toString());
  query.set("limit", (params?.limit || 100).toString());
  if (params?.role) query.set("role", params.role);
  if (params?.search) query.set("search", params.search.trim());
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/users${queryString ? `?${queryString}` : ""}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const payload: IApiResponse<IAdminUsersPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch admin users"));
  }

  return payload;
}

export async function getClientAdminUsers(
  params?: GetAdminUsersParams,
): Promise<IAdminUsersPayload> {
  const query = new URLSearchParams();
  query.set("page", (params?.page || 1).toString());
  query.set("limit", (params?.limit || 100).toString());
  if (params?.role) query.set("role", params.role);
  if (params?.search) query.set("search", params.search.trim());
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = `/api/admin/users${queryString ? `?${queryString}` : ""}`;
  const res = await fetch(url);
  const data: IApiResponse<IAdminUsersPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch admin users"));
  }

  return data.payload;
}

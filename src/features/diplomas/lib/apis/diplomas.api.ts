import { env } from "@/shared/lib/constants/env.constant";
import type { IApiResponse } from "@/shared/lib/types/api";
import type { IDiplomasPayload, IDiplomaDetailsPayload } from "@/shared/lib/types/diploma";

export interface GetDiplomasParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  immutable?: boolean;
  search?: string;
}

export async function getDiplomas(
  params?: GetDiplomasParams,
  token?: string,
): Promise<IApiResponse<IDiplomasPayload>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.immutable !== undefined) query.set("immutable", params.immutable.toString());
  if (params?.search) query.set("search", params.search.trim());

  const queryString = query.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/diplomas${queryString ? `?${queryString}` : ""}`;

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

  const payload: IApiResponse<IDiplomasPayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to fetch diplomas");
  }

  return payload;
}

export async function getClientDiplomas(
  params?: GetDiplomasParams,
): Promise<IDiplomasPayload> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.immutable !== undefined) query.set("immutable", params.immutable.toString());
  if (params?.search) query.set("search", params.search.trim());

  const queryString = query.toString();
  const url = `/api/diplomas${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url);
  const data: IApiResponse<IDiplomasPayload> = await res.json();

  if (!res.ok || !data.status || !data.payload) {
    throw new Error(data.message || "Failed to fetch diplomas");
  }

  return data.payload;
}

export async function getDiplomaById(
  id: string,
  token?: string,
): Promise<IApiResponse<IDiplomaDetailsPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/diplomas/${id}`;
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

  const payload: IApiResponse<IDiplomaDetailsPayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to fetch diploma details");
  }

  return payload;
}

export async function getClientDiplomaById(
  id: string,
): Promise<IDiplomaDetailsPayload> {
  const url = `/api/diplomas/${id}`;
  const res = await fetch(url);
  const data: IApiResponse<IDiplomaDetailsPayload> = await res.json();

  if (!res.ok || !data.status || !data.payload) {
    throw new Error(data.message || "Failed to fetch diploma details");
  }

  return data.payload;
}

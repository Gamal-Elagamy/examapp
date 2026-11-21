import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import type { IApiResponse } from "@/shared/lib/types/api";
import type {
  IDiploma,
  IDiplomasPayload,
  IDiplomaDetailsPayload,
} from "@/shared/lib/types/diploma";

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

  const payload: IApiResponse<IDiplomasPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch diplomas"));
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
  const data: IApiResponse<IDiplomasPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch diplomas"));
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

  const payload: IApiResponse<IDiplomaDetailsPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch diploma details"));
  }

  return payload;
}

export async function getClientDiplomaById(
  id: string,
): Promise<IDiplomaDetailsPayload> {
  const url = `/api/diplomas/${id}`;
  const res = await fetch(url);
  const data: IApiResponse<IDiplomaDetailsPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch diploma details"));
  }

  return data.payload;
}

export interface DiplomaMutationPayload {
  title: string;
  description: string;
  image: string;
}

export interface DiplomaMutationResponse {
  message?: string;
  diploma?: IDiploma;
}

export async function createDiploma(
  payload: DiplomaMutationPayload,
  token?: string,
): Promise<DiplomaMutationResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/diplomas`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to create diploma"));
  }

  return data;
}

export async function getClientCreateDiploma(
  payload: DiplomaMutationPayload,
): Promise<DiplomaMutationResponse> {
  const url = `/api/diplomas`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to create diploma"));
  }

  return data;
}

export async function updateDiploma(
  id: string,
  payload: DiplomaMutationPayload,
  token?: string,
): Promise<DiplomaMutationResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/diplomas/${id}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to update diploma"));
  }

  return data;
}

export async function getClientUpdateDiploma(
  id: string,
  payload: DiplomaMutationPayload,
): Promise<DiplomaMutationResponse> {
  const url = `/api/diplomas/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to update diploma"));
  }

  return data;
}

export async function deleteDiploma(
  id: string,
  token?: string,
): Promise<{ message: string }> {
  const url = `${env.NEXT_PUBLIC_API_URL}/diplomas/${id}`;
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "DELETE",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to delete diploma"));
  }

  return data || { message: "Diploma deleted successfully" };
}

export async function getClientDeleteDiploma(
  id: string,
): Promise<{ message: string }> {
  const url = `/api/diplomas/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to delete diploma"));
  }

  return data || { message: "Diploma deleted successfully" };
}


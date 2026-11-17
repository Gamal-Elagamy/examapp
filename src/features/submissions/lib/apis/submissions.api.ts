import { env } from "@/shared/lib/constants/env.constant";
import type { IApiResponse } from "@/shared/lib/types/api";
import type {
  ICreateSubmissionInput,
  ISubmissionDetailsPayload,
  ISubmissionsListPayload,
  GetSubmissionsParams,
} from "@/shared/lib/types/submission";

export async function createSubmission(
  input: ICreateSubmissionInput,
  token?: string,
): Promise<IApiResponse<ISubmissionDetailsPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/submissions`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });

  const payload: IApiResponse<ISubmissionDetailsPayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to submit exam");
  }

  return payload;
}

export async function getClientCreateSubmission(
  input: ICreateSubmissionInput,
): Promise<ISubmissionDetailsPayload> {
  const url = `/api/submissions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data: IApiResponse<ISubmissionDetailsPayload> = await res.json();

  if (!res.ok || !data.status || !data.payload) {
    throw new Error(data.message || "Failed to submit exam");
  }

  return data.payload;
}

export async function getSubmissions(
  params?: GetSubmissionsParams,
  token?: string,
): Promise<IApiResponse<ISubmissionsListPayload>> {
  const query = new URLSearchParams();
  if (params?.examId) query.set("examId", params.examId);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search.trim());

  const queryString = query.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/submissions${queryString ? `?${queryString}` : ""}`;

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

  const payload: IApiResponse<ISubmissionsListPayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to fetch submissions");
  }

  return payload;
}

export async function getSubmissionById(
  id: string,
  token?: string,
): Promise<IApiResponse<ISubmissionDetailsPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/submissions/${id}`;
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

  const payload: IApiResponse<ISubmissionDetailsPayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to fetch submission analytics");
  }

  return payload;
}

export async function getClientSubmissionById(
  id: string,
): Promise<ISubmissionDetailsPayload> {
  const url = `/api/submissions/${id}`;
  const res = await fetch(url);
  const data: IApiResponse<ISubmissionDetailsPayload> = await res.json();

  if (!res.ok || !data.status || !data.payload) {
    throw new Error(data.message || "Failed to fetch submission analytics");
  }

  return data.payload;
}

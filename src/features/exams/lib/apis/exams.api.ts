import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import type { IApiResponse } from "@/shared/lib/types/api";
import type {
  IExamsPayload,
  IExamDetailsPayload,
  IExamDetails,
} from "@/shared/lib/types/exam";

export interface GetExamsParams {
  page?: number;
  limit?: number;
  search?: string;
  diploma?: string;
  diplomaId?: string;
  immutable?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getExams(
  params?: GetExamsParams,
  token?: string,
): Promise<IApiResponse<IExamsPayload>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search.trim());
  const diplomaId = params?.diplomaId || params?.diploma;
  if (diplomaId) query.set("diplomaId", diplomaId);
  if (params?.immutable !== undefined) query.set("immutable", params.immutable.toString());
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/exams${queryString ? `?${queryString}` : ""}`;

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

  const payload: IApiResponse<IExamsPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch exams"));
  }

  return payload;
}

export async function getClientExams(
  params?: GetExamsParams,
): Promise<IExamsPayload> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search.trim());
  const diplomaId = params?.diplomaId || params?.diploma;
  if (diplomaId) query.set("diplomaId", diplomaId);
  if (params?.immutable !== undefined) query.set("immutable", params.immutable.toString());
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = `/api/exams${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url);
  const data: IApiResponse<IExamsPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch exams"));
  }

  return data.payload;
}

export async function getExamById(
  id: string,
  token?: string,
): Promise<IApiResponse<IExamDetailsPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/exams/${id}`;
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

  const payload: IApiResponse<IExamDetailsPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch exam details"));
  }

  return payload;
}

export async function getClientExamById(
  id: string,
): Promise<IExamDetailsPayload> {
  const url = `/api/exams/${id}`;
  const res = await fetch(url);
  const data: IApiResponse<IExamDetailsPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch exam details"));
  }

  return data.payload;
}

export interface ExamMutationPayload {
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
}

export interface ExamMutationResponse {
  message?: string;
  exam?: IExamDetails;
}

export async function createExam(
  payload: ExamMutationPayload,
  token?: string,
): Promise<ExamMutationResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/exams`;
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
    throw new Error(extractErrorMessage(data, "Failed to create exam"));
  }

  return data;
}

export async function getClientCreateExam(
  payload: ExamMutationPayload,
): Promise<ExamMutationResponse> {
  const url = `/api/exams`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to create exam"));
  }

  return data;
}

export async function updateExam(
  id: string,
  payload: ExamMutationPayload,
  token?: string,
): Promise<ExamMutationResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/exams/${id}`;
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
    throw new Error(extractErrorMessage(data, "Failed to update exam"));
  }

  return data;
}

export async function getClientUpdateExam(
  id: string,
  payload: ExamMutationPayload,
): Promise<ExamMutationResponse> {
  const url = `/api/exams/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to update exam"));
  }

  return data;
}

export async function deleteExam(
  id: string,
  token?: string,
): Promise<{ message: string }> {
  const url = `${env.NEXT_PUBLIC_API_URL}/exams/${id}`;
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
    throw new Error(extractErrorMessage(data, "Failed to delete exam"));
  }

  return data || { message: "Exam deleted successfully" };
}

export async function getClientDeleteExam(
  id: string,
): Promise<{ message: string }> {
  const url = `/api/exams/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to delete exam"));
  }

  return data || { message: "Exam deleted successfully" };
}

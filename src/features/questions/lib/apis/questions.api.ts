import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import type { IApiResponse } from "@/shared/lib/types/api";
import type {
  IExamQuestionsPayload,
  GetExamQuestionsParams,
} from "@/shared/lib/types/question";
import type { IExamDetailsPayload } from "@/shared/lib/types/exam";

export async function getExamQuestions(
  examId: string,
  params?: GetExamQuestionsParams,
  token?: string,
): Promise<IApiResponse<IExamQuestionsPayload>> {
  const query = new URLSearchParams();
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.immutable !== undefined) query.set("immutable", params.immutable.toString());
  if (params?.search) query.set("search", params.search.trim());

  const queryString = query.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/questions/exam/${examId}${queryString ? `?${queryString}` : ""}`;

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

  const payload: IApiResponse<IExamQuestionsPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch exam questions"));
  }

  return payload;
}

export async function getClientExamQuestions(
  examId: string,
  params?: GetExamQuestionsParams,
): Promise<IExamQuestionsPayload> {
  const query = new URLSearchParams();
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.immutable !== undefined) query.set("immutable", params.immutable.toString());
  if (params?.search) query.set("search", params.search.trim());

  const queryString = query.toString();
  const url = `/api/questions/exam/${examId}${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url);
  const data: IApiResponse<IExamQuestionsPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch exam questions"));
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

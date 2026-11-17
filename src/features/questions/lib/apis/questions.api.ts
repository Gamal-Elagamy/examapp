import { env } from "@/shared/lib/constants/env.constant";
import type { IApiResponse } from "@/shared/lib/types/api";
import type {
  IExamQuestionsPayload,
  GetExamQuestionsParams,
} from "@/shared/lib/types/question";

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

  const payload: IApiResponse<IExamQuestionsPayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to fetch exam questions");
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
  const data: IApiResponse<IExamQuestionsPayload> = await res.json();

  if (!res.ok || !data.status || !data.payload) {
    throw new Error(data.message || "Failed to fetch exam questions");
  }

  return data.payload;
}

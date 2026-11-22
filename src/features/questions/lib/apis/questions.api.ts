import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import type { IApiResponse } from "@/shared/lib/types/api";
import type {
  IExamQuestionsPayload,
  IQuestion,
  GetExamQuestionsParams,
} from "@/shared/lib/types/question";
import type { IExamDetailsPayload } from "@/shared/lib/types/exam";

export interface IQuestionPayload {
  question: IQuestion;
}

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

export async function getQuestionById(
  id: string,
  token?: string,
): Promise<IApiResponse<IQuestionPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/questions/${id}`;
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

  const payload: IApiResponse<IQuestionPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch question"));
  }

  return payload;
}

export async function getClientQuestionById(
  id: string,
): Promise<IQuestionPayload> {
  const url = `/api/questions/${id}`;
  const res = await fetch(url);
  const data: IApiResponse<IQuestionPayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch question"));
  }

  return data.payload;
}

export async function deleteQuestion(
  id: string,
  token?: string,
): Promise<IApiResponse<null>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/questions/${id}`;
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
    throw new Error(extractErrorMessage(payload, "Failed to delete question"));
  }

  return payload;
}

export async function getClientDeleteQuestion(id: string): Promise<void> {
  const url = `/api/questions/${id}`;
  const res = await fetch(url, { method: "DELETE" });
  const data: IApiResponse<null> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status) {
    throw new Error(extractErrorMessage(data, "Failed to delete question"));
  }
}

export interface ICreateQuestionAnswer {
  text: string;
  isCorrect: boolean;
}

export interface ICreateQuestionBody {
  text: string;
  answers: ICreateQuestionAnswer[];
}

export async function createQuestion(
  examId: string,
  data: ICreateQuestionBody,
  token?: string,
): Promise<IApiResponse<IQuestionPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/questions/exam/${examId}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const payload: IApiResponse<IQuestionPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to create question"));
  }

  return payload;
}

export async function getClientCreateQuestion(
  examId: string,
  data: ICreateQuestionBody,
): Promise<IQuestion> {
  const url = `/api/questions/exam/${examId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json: IApiResponse<IQuestionPayload> = await res.json().catch(() => null);

  if (!res.ok || !json || !json.status || !json.payload) {
    throw new Error(extractErrorMessage(json, "Failed to create question"));
  }

  return json.payload.question;
}

export async function updateQuestion(
  id: string,
  data: ICreateQuestionBody,
  token?: string,
): Promise<IApiResponse<IQuestionPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/questions/${id}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const payload: IApiResponse<IQuestionPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to update question"));
  }

  return payload;
}

export async function getClientUpdateQuestion(
  id: string,
  data: ICreateQuestionBody,
): Promise<IQuestion> {
  const url = `/api/questions/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json: IApiResponse<IQuestionPayload> = await res.json().catch(() => null);

  if (!res.ok || !json || !json.status || !json.payload) {
    throw new Error(extractErrorMessage(json, "Failed to update question"));
  }

  return json.payload.question;
}

export interface IBulkQuestionsPayload {
  message?: string;
  questions: IQuestion[];
  count?: number;
}

export interface IBulkQuestionsBody {
  questions: ICreateQuestionBody[];
}

export async function bulkCreateQuestions(
  examId: string,
  data: IBulkQuestionsBody,
  token?: string,
): Promise<IApiResponse<IBulkQuestionsPayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/questions/exam/${examId}/bulk`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const payload: IApiResponse<IBulkQuestionsPayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to bulk create questions"));
  }

  return payload;
}

export async function getClientBulkCreateQuestions(
  examId: string,
  data: IBulkQuestionsBody,
): Promise<IBulkQuestionsPayload> {
  const url = `/api/questions/exam/${examId}/bulk`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json: IApiResponse<IBulkQuestionsPayload> = await res.json().catch(() => null);

  if (!res.ok || !json || !json.status || !json.payload) {
    throw new Error(extractErrorMessage(json, "Failed to bulk create questions"));
  }

  return json.payload;
}

import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";

export interface IUploadResponse {
  url: string;
}

export async function uploadFile(
  formData: FormData,
  token?: string,
): Promise<IUploadResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/upload`;
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, `Failed to upload file (${res.status})`));
  }

  // Handle both { url: "..." } and { payload: { url: "..." } } or { data: { url: "..." } }
  const fileUrl = data?.url || data?.payload?.url || data?.data?.url;

  if (!fileUrl) {
    throw new Error("No URL returned from upload server");
  }

  return { url: fileUrl };
}

export async function getClientUploadFile(
  formData: FormData,
): Promise<IUploadResponse> {
  const url = `/api/upload`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.url) {
    throw new Error(extractErrorMessage(data, "Failed to upload file"));
  }

  return data;
}

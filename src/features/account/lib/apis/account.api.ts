import { env } from "@/shared/lib/constants/env.constant";
import type { IApiResponse } from "@/shared/lib/types/api";
import type { IUserProfilePayload } from "@/shared/lib/types/user";

export async function getUserProfile(
  token?: string,
): Promise<IApiResponse<IUserProfilePayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/users/profile`;
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

  const payload: IApiResponse<IUserProfilePayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to fetch user profile");
  }

  return payload;
}

export async function getClientUserProfile(): Promise<IUserProfilePayload> {
  const url = `/api/users/profile`;
  const res = await fetch(url);
  const data: IApiResponse<IUserProfilePayload> = await res.json();

  if (!res.ok || !data.status || !data.payload) {
    throw new Error(data.message || "Failed to fetch user profile");
  }

  return data.payload;
}

export async function updateUserProfile(
  body: Record<string, unknown>,
  token?: string,
): Promise<IApiResponse<IUserProfilePayload>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/users/profile`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  const payload: IApiResponse<IUserProfilePayload> = await res.json();

  if (!res.ok || !payload.status) {
    throw new Error(payload.message || "Failed to update profile");
  }

  return payload;
}

export async function getClientUpdateUserProfile(
  body: Record<string, unknown>,
): Promise<IUserProfilePayload> {
  const url = `/api/users/profile`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data: IApiResponse<IUserProfilePayload> = await res.json();

  if (!res.ok || !data.status || !data.payload) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data.payload;
}

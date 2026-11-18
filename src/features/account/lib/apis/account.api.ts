import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import type { IApiResponse } from "@/shared/lib/types/api";
import type { IUserProfilePayload } from "@/shared/lib/types/user";

export interface IRequestChangeEmailResponse {
  status?: boolean;
  code?: number;
  message: string;
}

export interface IConfirmChangeEmailResponse {
  message: string;
  user: IUserProfilePayload["user"];
}

export interface IChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordResponse {
  message: string;
}

export interface IDeleteAccountResponse {
  status?: boolean;
  code?: number;
  message: string;
}

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

  const payload: IApiResponse<IUserProfilePayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to fetch user profile"));
  }

  return payload;
}

export async function getClientUserProfile(): Promise<IUserProfilePayload> {
  const url = `/api/users/profile`;
  const res = await fetch(url);
  const data: IApiResponse<IUserProfilePayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to fetch user profile"));
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
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  const payload: IApiResponse<IUserProfilePayload> = await res.json().catch(() => null);

  if (!res.ok || !payload || !payload.status) {
    throw new Error(extractErrorMessage(payload, "Failed to update profile"));
  }

  return payload;
}

export async function getClientUpdateUserProfile(
  body: Record<string, unknown>,
): Promise<IUserProfilePayload> {
  const url = `/api/users/profile`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data: IApiResponse<IUserProfilePayload> = await res.json().catch(() => null);

  if (!res.ok || !data || !data.status || !data.payload) {
    throw new Error(extractErrorMessage(data, "Failed to update profile"));
  }

  return data.payload;
}

export async function requestChangeEmail(
  newEmail: string,
  token?: string,
): Promise<IRequestChangeEmailResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/users/email/request`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ newEmail }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to request email change"));
  }

  return data;
}

export async function getClientRequestChangeEmail(
  newEmail: string,
): Promise<IRequestChangeEmailResponse> {
  const url = `/api/users/email/request`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newEmail }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to request email change"));
  }

  return data;
}

export async function confirmChangeEmail(
  code: string,
  token?: string,
): Promise<IConfirmChangeEmailResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/users/email/confirm`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ code }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to verify email code"));
  }

  return data;
}

export async function getClientConfirmChangeEmail(
  code: string,
): Promise<IConfirmChangeEmailResponse> {
  const url = `/api/users/email/confirm`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to verify email code"));
  }

  return data;
}

export async function changePassword(
  input: IChangePasswordInput,
  token?: string,
): Promise<IChangePasswordResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/users/change-password`;
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

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to change password"));
  }

  return data;
}

export async function getClientChangePassword(
  input: IChangePasswordInput,
): Promise<IChangePasswordResponse> {
  const url = `/api/users/change-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to change password"));
  }

  return data;
}

export async function deleteAccount(
  token?: string,
): Promise<IDeleteAccountResponse> {
  const url = `${env.NEXT_PUBLIC_API_URL}/users/account`;
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

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to delete account"));
  }

  return data;
}

export async function getClientDeleteAccount(): Promise<IDeleteAccountResponse> {
  const url = `/api/users/account`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Failed to delete account"));
  }

  return data;
}

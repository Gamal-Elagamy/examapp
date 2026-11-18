import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import type { IUser } from "@/shared/lib/types/user";

export interface SendEmailVerificationPayload {
  email: string;
}

export interface SendEmailVerificationResponse {
  status?: boolean;
  code?: number;
  message: string;
}

export interface ConfirmEmailVerificationPayload {
  email: string;
  code: string;
}

export interface ConfirmEmailVerificationResponse {
  status?: boolean;
  message: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface RegisterResponse {
  user: IUser;
  token: string;
  message?: string;
}

export interface ForgotPasswordPayload {
  email: string;
  redirectUrl: string;
}

export interface ForgotPasswordResponse {
  status?: boolean;
  code?: number;
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  status?: boolean;
  code?: number;
  message: string;
}

export async function sendEmailVerificationApi(
  payload: SendEmailVerificationPayload,
): Promise<SendEmailVerificationResponse> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/send-email-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Failed to send verification code"));
  }

  return data;
}

export async function confirmEmailVerificationApi(
  payload: ConfirmEmailVerificationPayload,
): Promise<ConfirmEmailVerificationResponse> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/confirm-email-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Invalid or expired verification code"));
  }

  return data;
}

export async function registerApi(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Registration failed"));
  }

  return data;
}

export async function forgotPasswordApi(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Failed to send password reset email"));
  }

  return data;
}

export async function resetPasswordApi(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Failed to reset password"));
  }

  return data;
}

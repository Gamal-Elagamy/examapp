import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IErrorItem } from "./types/api";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function extractErrorMessage(
  data: unknown,
  fallbackMessage = "Something went wrong",
): string {
  if (!data || typeof data !== "object") {
    return fallbackMessage;
  }

  const err = data as {
    message?: string;
    errors?: IErrorItem[];
  };

  if (Array.isArray(err.errors) && err.errors.length > 0) {
    const errorDetails = err.errors
      .map((item) => {
        const text =
          item.message ||
          (Array.isArray(item.messages) ? item.messages.join(", ") : "");
        return item.path && text ? `${item.path}: ${text}` : text;
      })
      .filter(Boolean)
      .join(" | ");

    if (errorDetails) {
      return errorDetails;
    }
  }

  return err.message || fallbackMessage;
}

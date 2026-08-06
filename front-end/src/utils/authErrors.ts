import type { AxiosError } from "axios";

type FieldErrors = Record<string, string[]>;

export function parseApiErrors(error: unknown): {
  message: string;
  fieldErrors: FieldErrors;
} {
  const fallback = {
    message: "Something went wrong. Please try again.",
    fieldErrors: {} as FieldErrors,
  };

  if (!error || typeof error !== "object" || !("response" in error)) {
    return fallback;
  }

  const axiosError = error as AxiosError<FieldErrors & { detail?: string }>;
  const data = axiosError.response?.data;

  if (!data) return fallback;

  if (typeof data.detail === "string") {
    return { message: data.detail, fieldErrors: {} };
  }

  const fieldErrors: FieldErrors = {};
  let firstMessage = "";

  for (const [key, value] of Object.entries(data)) {
    if (key === "detail") continue;
    if (Array.isArray(value) && value.length > 0) {
      fieldErrors[key] = value;
      if (!firstMessage) firstMessage = value[0];
    }
  }

  return {
    message: firstMessage || fallback.message,
    fieldErrors,
  };
}

export function getFieldError(
  fieldErrors: FieldErrors,
  field: string,
): string | undefined {
  return fieldErrors[field]?.[0];
}

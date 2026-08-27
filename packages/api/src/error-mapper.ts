import type { ApiError } from "./http-contracts";
import { AuthenticationError, AuthorizationError } from "./auth-errors";
export function mapApiError(error: unknown, requestId: string): ApiError {
  if (error instanceof AuthenticationError) return { code: error.code, message: error.message, requestId };
  if (error instanceof AuthorizationError) return { code: error.code, message: error.message, requestId };
  const message = error instanceof Error ? error.message : "Internal server error";
  if (/not found/i.test(message)) return { code: "NOT_FOUND", message, requestId };
  if (/permission|tenant mismatch/i.test(message)) return { code: "FORBIDDEN", message, requestId };
  if (/required|invalid|unavailable|insufficient/i.test(message)) return { code: "VALIDATION_ERROR", message, requestId };
  return { code: "INTERNAL_ERROR", message: "Internal server error", requestId };
}

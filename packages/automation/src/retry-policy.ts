export type RetryPolicy = { maxAttempts: number; baseDelayMs: number; maxDelayMs: number };

export const defaultRetryPolicy: RetryPolicy = { maxAttempts: 3, baseDelayMs: 1000, maxDelayMs: 30_000 };

export function retryDelayMs(attempt: number, policy: RetryPolicy = defaultRetryPolicy) {
  if (attempt < 1) return 0;
  const exponential = policy.baseDelayMs * 2 ** (attempt - 1);
  return Math.min(Math.max(exponential, 0), policy.maxDelayMs);
}

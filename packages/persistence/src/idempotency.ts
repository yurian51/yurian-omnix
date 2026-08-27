export interface IdempotencyStore { get(scope: { tenantId: string }, key: string): Promise<{ result: unknown } | null>; put(scope: { tenantId: string }, key: string, result: unknown): Promise<void>; }

export async function runIdempotent<T>(store: IdempotencyStore, scope: { tenantId: string }, key: string, operation: () => Promise<T>): Promise<T> {
  if (!scope.tenantId.trim() || !key.trim()) throw new Error("tenantId and idempotency key are required");
  const existing = await store.get(scope, key);
  if (existing) return existing.result as T;
  const result = await operation();
  await store.put(scope, key, result);
  return result;
}

export interface TransactionContext { tenantId: string; }
export interface TransactionRunner { run<T>(context: TransactionContext, operation: (tx: unknown) => Promise<T>): Promise<T>; }

export async function withTenantTransaction<T>(runner: TransactionRunner, tenantId: string, operation: (tx: unknown) => Promise<T>) {
  if (!tenantId.trim()) throw new Error("tenantId is required for transaction");
  return runner.run({ tenantId }, operation);
}

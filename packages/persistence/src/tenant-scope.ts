export type TenantScope = { tenantId: string };

export function assertTenantScope(scope: TenantScope) {
  if (!scope.tenantId || !scope.tenantId.trim()) throw new Error("tenantId is required");
  return scope;
}

export interface TenantRepository<T> {
  get(scope: TenantScope, id: string): Promise<T | null>;
  list(scope: TenantScope, limit?: number): Promise<T[]>;
  create(scope: TenantScope, value: T): Promise<T>;
  update(scope: TenantScope, id: string, patch: Partial<T>): Promise<T>;
}

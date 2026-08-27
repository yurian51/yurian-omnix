export type RequestPrincipal = { userId: string; tenantId: string; roles: string[]; permissions: string[] };

export function resolveTenantContext(principal: RequestPrincipal, requestedTenantId?: string) {
  if (!principal.tenantId) throw new Error("Tenant context is required");
  if (requestedTenantId && requestedTenantId !== principal.tenantId) throw new Error("Tenant mismatch");
  return { tenantId: principal.tenantId, userId: principal.userId, roles: [...principal.roles], permissions: [...principal.permissions] };
}

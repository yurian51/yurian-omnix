export type TenantContext = {
  tenantId: string;
  userId?: string;
  roles: string[];
};

export function requireTenantContext(context: TenantContext | undefined): TenantContext {
  if (!context?.tenantId) throw new Error("Tenant context is required");
  return context;
}

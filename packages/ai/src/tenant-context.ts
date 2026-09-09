export type TenantExecutionContext = {
  tenantId: string;
  actorId?: string;
  requestId?: string;
};

export function assertTenantContext(
  context: TenantExecutionContext | undefined,
): asserts context is TenantExecutionContext {
  if (!context?.tenantId?.trim()) {
    throw new Error("tenantId is required");
  }
}

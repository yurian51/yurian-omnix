import type { Permission, Role } from "./rbac";

export type AuthContext = {
  userId: string;
  tenantId: string;
  role: Role;
  permissions: readonly Permission[];
};

export function assertTenant(context: AuthContext, tenantId: string) {
  if (context.tenantId !== tenantId) throw new Error("Tenant access denied");
}

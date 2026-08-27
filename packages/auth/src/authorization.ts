import type { AuthContext } from "./context";
import type { Permission } from "./rbac";
import { hasPermission } from "./rbac";

export function assertPermission(context: AuthContext, permission: Permission): void {
  if (!hasPermission(context.role, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

export function authorize(context: AuthContext, permission: Permission, tenantId: string): void {
  if (context.tenantId !== tenantId) throw new Error("Tenant access denied");
  assertPermission(context, permission);
}

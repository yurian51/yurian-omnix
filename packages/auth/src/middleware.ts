import type { AuthContext } from "./context";
import type { AccessTokenVerifier } from "./token";
import { hasPermission, type Permission } from "./rbac";

export async function authenticateBearer(
  authorization: string | undefined,
  verifier: AccessTokenVerifier,
): Promise<AuthContext> {
  if (!authorization?.startsWith("Bearer ")) throw new Error("Authentication required");
  const token = authorization.slice("Bearer ".length).trim();
  const claims = await verifier.verify(token);
  if (claims.exp <= Math.floor(Date.now() / 1000)) throw new Error("Access token expired");
  const permissions = permissionSet(claims.role);
  return { userId: claims.sub, tenantId: claims.tenantId, role: claims.role, permissions };
}

function permissionSet(role: AuthContext["role"]): readonly Permission[] {
  const all: Permission[] = ["inbox.read","inbox.reply","inbox.assign","inbox.manage","orders.read","orders.create","customers.read","customers.manage","settings.manage","billing.manage","analytics.read"];
  return all.filter((permission) => hasPermission(role, permission));
}

export type AuthContext = { tenantId: string; userId: string; roles: string[] };

export function requireBearerAuth(authorization: string | undefined): string {
  if (!authorization?.startsWith("Bearer ")) throw new Error("unauthorized");
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new Error("unauthorized");
  return token;
}

export type TokenResolver = (token: string) => Promise<AuthContext | null>;

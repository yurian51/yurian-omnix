export type AccessTokenClaims = {
  sub: string;
  tenantId: string;
  role: "OWNER" | "ADMIN" | "SUPERVISOR" | "AGENT" | "VIEWER";
  exp: number;
};

export interface AccessTokenVerifier {
  verify(token: string): Promise<AccessTokenClaims>;
}

export class ConfiguredTokenVerifier implements AccessTokenVerifier {
  constructor(private readonly verifyToken: (token: string) => Promise<AccessTokenClaims>) {}
  verify(token: string) {
    if (!token.trim()) throw new Error("Access token is required");
    return this.verifyToken(token);
  }
}

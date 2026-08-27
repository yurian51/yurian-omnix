import { createHash } from "node:crypto";

export function createApprovalToken(input: { tenantId: string; userId: string; command: string; args: Record<string, string>; ttlSeconds?: number }) {
  const expiresAt = Math.floor(Date.now() / 1000) + (input.ttlSeconds ?? 300);
  const payload = JSON.stringify({ tenantId: input.tenantId, userId: input.userId, command: input.command, args: input.args, expiresAt });
  return `${expiresAt}.${createHash("sha256").update(payload).digest("hex").slice(0, 24)}`;
}

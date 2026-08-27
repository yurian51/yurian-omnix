import { createHash } from "node:crypto";

export function eventFingerprint(input: { tenantId: string; type: string; id: string }) {
  return createHash("sha256").update(`${input.tenantId}:${input.type}:${input.id}`).digest("hex");
}

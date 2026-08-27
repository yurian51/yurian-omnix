import { createHash } from "node:crypto";

export function webhookEventId(payload: Record<string, unknown>): string {
  const raw = JSON.stringify(payload);
  return `whatsapp:${createHash("sha256").update(raw, "utf8").digest("hex")}`;
}

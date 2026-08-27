import { createHmac, timingSafeEqual } from "node:crypto";

export type WhatsAppWebhookPayload = Record<string, unknown>;

export function verifyWebhookChallenge(
  mode: string | undefined,
  token: string | undefined,
  challenge: string | undefined,
  expectedToken: string | undefined,
): string | null {
  if (mode !== "subscribe" || !token || !challenge || !expectedToken) return null;
  return token === expectedToken ? challenge : null;
}

export function verifySignature(rawBody: string, signature: string | undefined, appSecret: string | undefined): boolean {
  if (!signature || !appSecret) return false;
  const [scheme, provided] = signature.split("=", 2);
  if (scheme !== "sha256" || !provided) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(provided, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function parseWebhookPayload(rawBody: string): WhatsAppWebhookPayload {
  const parsed: unknown = JSON.parse(rawBody);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid WhatsApp webhook payload");
  }
  return parsed as WhatsAppWebhookPayload;
}

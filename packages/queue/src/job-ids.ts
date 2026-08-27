import { createHash } from "node:crypto";

export function deterministicJobId(namespace: string, value: string): string {
  return `${namespace}:${createHash("sha256").update(value, "utf8").digest("hex").slice(0, 32)}`;
}

export function webhookJobId(provider: string, externalEventId: string): string {
  return deterministicJobId("webhook", `${provider}:${externalEventId}`);
}

export function messageJobId(provider: string, externalMessageId: string): string {
  return deterministicJobId("message", `${provider}:${externalMessageId}`);
}

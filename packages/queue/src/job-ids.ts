import { createHash } from "node:crypto";

export function deterministicJobId(namespace: string, value: string): string {
  return `${namespace}:${createHash("sha256").update(value, "utf8").digest("hex").slice(0, 32)}`;
}

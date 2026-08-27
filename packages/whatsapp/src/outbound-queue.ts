import type { WhatsAppProvider, WhatsAppSendResult } from "./types";

export type OutboundWhatsAppJob = { id: string; tenantId: string; channelId: string; messageId: string; to: string; body: string; attempts: number; maxAttempts: number; status: "QUEUED" | "PROCESSING" | "SENT" | "FAILED" };

export interface OutboundWhatsAppQueue { enqueue(job: OutboundWhatsAppJob): Promise<void>; update(job: OutboundWhatsAppJob): Promise<void>; }

export async function processOutboundMessage(job: OutboundWhatsAppJob, provider: WhatsAppProvider, queue: OutboundWhatsAppQueue): Promise<WhatsAppSendResult> {
  if (job.status !== "QUEUED" && job.status !== "PROCESSING") throw new Error("Outbound job is not processable");
  if (job.attempts >= job.maxAttempts) throw new Error("Outbound job retry limit reached");
  const next = { ...job, status: "PROCESSING" as const, attempts: job.attempts + 1 };
  await queue.update(next);
  try {
    const result = await provider.sendText({ to: job.to, body: job.body });
    await queue.update({ ...next, status: "SENT" });
    return result;
  } catch (error) {
    const failed = { ...next, status: next.attempts >= job.maxAttempts ? "FAILED" as const : "QUEUED" as const };
    await queue.update(failed);
    throw error;
  }
}

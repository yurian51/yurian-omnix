import type { Job } from "bullmq";
import type { WebhookProcessingJob } from "@omnix/queue";
import { normalizeDeliveryStatus } from "@omnix/whatsapp";

export async function processWhatsAppStatus(job: Job<WebhookProcessingJob>) {
  const payload = job.data.payload;
  const providerMessageId = typeof payload.providerMessageId === "string" ? payload.providerMessageId : "";
  const status = normalizeDeliveryStatus(payload.status);
  if (!providerMessageId || !status) throw new Error("Invalid WhatsApp status event");
  return { tenantId: job.data.tenantId, providerMessageId, status };
}

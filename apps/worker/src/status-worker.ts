import type { Job } from "bullmq";
import type { WebhookProcessingJob } from "@omnix/queue";
import { createDatabase, MessageStatusRepository } from "@omnix/database";
import { normalizeDeliveryStatus } from "@omnix/whatsapp";

const db = createDatabase();
const statuses = new MessageStatusRepository(db);

export async function processWhatsAppStatus(job: Job<WebhookProcessingJob>) {
  const payload = job.data.payload;
  const providerMessageId = typeof payload.providerMessageId === "string" ? payload.providerMessageId : "";
  const status = normalizeDeliveryStatus(payload.status);
  if (!providerMessageId || !status) throw new Error("Invalid WhatsApp status event");

  const updated = await statuses.updateByProviderMessageId({
    tenantId: job.data.tenantId,
    providerMessageId,
    status,
    errorCode: typeof payload.errorCode === "string" ? payload.errorCode : undefined,
    errorMessage: typeof payload.errorMessage === "string" ? payload.errorMessage : undefined,
  });

  return { tenantId: job.data.tenantId, providerMessageId, status, updated: Boolean(updated) };
}

import type { Job } from "bullmq";
import type { WhatsAppStatusJob } from "@omnix/queue";
import { createDatabase, MessageStatusRepository } from "@omnix/database";
import { normalizeDeliveryStatus } from "@omnix/whatsapp";

const db = createDatabase();
const statuses = new MessageStatusRepository(db);

export async function processWhatsAppStatus(job: Job<WhatsAppStatusJob>) {
  const input = job.data;
  const status = normalizeDeliveryStatus(input.status);
  if (!input.providerMessageId || !status) throw new Error("Invalid WhatsApp status event");

  const updated = await statuses.updateByProviderMessageId({
    tenantId: input.tenantId,
    providerMessageId: input.providerMessageId,
    status,
    errorCode: input.errorCode,
    errorMessage: input.errorMessage,
  });

  return { tenantId: input.tenantId, providerMessageId: input.providerMessageId, status, updated: Boolean(updated) };
}

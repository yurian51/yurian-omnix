import { createQueues, createRedisConnection, deterministicJobId } from "./index";
import type { WhatsAppStatusEvent } from "@omnix/whatsapp";

export async function dispatchWhatsAppStatus(redisUrl: string, tenantId: string, event: WhatsAppStatusEvent) {
  const connection = createRedisConnection(redisUrl);
  const queues = createQueues(connection);
  try {
    return await queues.webhook.add("status-update", {
      tenantId,
      provider: "whatsapp",
      externalEventId: `${event.providerMessageId}:${event.status}:${event.timestamp ?? ""}`,
      eventType: "message.status",
      payload: event,
    }, { jobId: deterministicJobId("status", `${tenantId}:${event.providerMessageId}:${event.status}:${event.timestamp ?? ""}`) });
  } finally {
    await connection.quit();
  }
}

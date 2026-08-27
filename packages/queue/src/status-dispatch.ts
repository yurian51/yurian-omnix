import { createQueues, createRedisConnection, deterministicJobId } from "./index";
import type { WhatsAppStatusEvent } from "@omnix/whatsapp";

export async function dispatchWhatsAppStatus(redisUrl: string, tenantId: string, event: WhatsAppStatusEvent) {
  const connection = createRedisConnection(redisUrl);
  const queues = createQueues(connection);
  const eventKey = `${tenantId}:${event.providerMessageId}:${event.status}:${event.timestamp ?? ""}`;
  try {
    return await queues.messageStatus.add("status-update", {
      tenantId,
      providerMessageId: event.providerMessageId,
      status: event.status,
      timestamp: event.timestamp,
      errorCode: event.errorCode,
      errorMessage: event.errorMessage,
    }, { jobId: deterministicJobId("status", eventKey) });
  } finally {
    await connection.quit();
  }
}

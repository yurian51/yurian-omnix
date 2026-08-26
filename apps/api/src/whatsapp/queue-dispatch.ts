import { deterministicJobId, createQueues, createRedisConnection } from "@omnix/queue";
import type { OmnixInboundMessage } from "./events";

export async function dispatchInboundMessages(redisUrl: string, messages: OmnixInboundMessage[], tenantId: string) {
  const connection = createRedisConnection(redisUrl);
  const queues = createQueues(connection);

  try {
    await Promise.all(
      messages.map((message) =>
        queues.incomingMessages.add(
          "process-message",
          {
            tenantId,
            phoneNumberId: message.phoneNumberId,
            externalMessageId: message.externalMessageId,
            from: message.from,
            timestamp: message.timestamp,
            type: message.type,
            text: message.text,
            raw: message.raw,
          },
          { jobId: deterministicJobId("message", `${tenantId}:${message.externalMessageId}`) },
        ),
      ),
    );
  } finally {
    await connection.quit();
  }
}

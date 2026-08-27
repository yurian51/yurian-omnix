import { createQueues, createRedisConnection, deterministicJobId } from "./index";

export async function dispatchOutgoingText(redisUrl: string, input: { tenantId: string; conversationId: string; phoneNumberId: string; to: string; body: string; idempotencyKey?: string }) {
  const connection = createRedisConnection(redisUrl);
  const queues = createQueues(connection);
  const idempotencyKey = input.idempotencyKey ?? `${input.tenantId}:${input.conversationId}:${input.to}:${input.body}`;
  try {
    return await queues.outgoingMessages.add("send-text", {
      tenantId: input.tenantId,
      conversationId: input.conversationId,
      phoneNumberId: input.phoneNumberId,
      to: input.to,
      type: "text",
      payload: { body: input.body },
      idempotencyKey,
    }, { jobId: deterministicJobId("outgoing", idempotencyKey) });
  } finally {
    await connection.quit();
  }
}

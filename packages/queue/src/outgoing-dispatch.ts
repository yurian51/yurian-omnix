import { createQueues, createRedisConnection, deterministicJobId } from "./index";

export async function dispatchOutgoingText(redisUrl: string, input: { tenantId: string; phoneNumberId: string; to: string; body: string; idempotencyKey?: string }) {
  const connection = createRedisConnection(redisUrl);
  const queues = createQueues(connection);
  try {
    return await queues.outgoingMessages.add("send-text", {
      tenantId: input.tenantId,
      phoneNumberId: input.phoneNumberId,
      to: input.to,
      type: "text",
      payload: { body: input.body },
      idempotencyKey: input.idempotencyKey ?? `${input.tenantId}:${input.phoneNumberId}:${input.to}:${input.body}`,
    }, { jobId: deterministicJobId("outgoing", input.idempotencyKey ?? `${input.tenantId}:${input.phoneNumberId}:${input.to}:${input.body}`) });
  } finally {
    await connection.quit();
  }
}

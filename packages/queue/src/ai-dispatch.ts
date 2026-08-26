import { deterministicJobId, createQueues, createRedisConnection } from "./index";

export async function dispatchAIRequest(redisUrl: string, input: { tenantId: string; conversationId: string; messageId: string }) {
  const connection = createRedisConnection(redisUrl);
  const queues = createQueues(connection);
  try {
    return await queues.ai.add(
      "process-ai-request",
      input,
      { jobId: deterministicJobId("ai", `${input.tenantId}:${input.messageId}`) },
    );
  } finally {
    await connection.quit();
  }
}

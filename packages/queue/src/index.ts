import { Queue } from "bullmq";
import IORedis from "ioredis";
import { QUEUES, type AIRequestJob, type IncomingMessageJob, type OutgoingMessageJob, type WebhookProcessingJob } from "./contracts";

export * from "./contracts";

export function createRedisConnection(url: string): IORedis {
  return new IORedis(url, { maxRetriesPerRequest: null });
}

export function createQueues(connection: IORedis) {
  return {
    webhook: new Queue<WebhookProcessingJob>(QUEUES.webhook, { connection }),
    incomingMessages: new Queue<IncomingMessageJob>(QUEUES.incomingMessages, { connection }),
    outgoingMessages: new Queue<OutgoingMessageJob>(QUEUES.outgoingMessages, { connection }),
    ai: new Queue<AIRequestJob>(QUEUES.ai, { connection }),
  };
}

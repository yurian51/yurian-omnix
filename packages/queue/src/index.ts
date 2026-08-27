import { Queue } from "bullmq";
import IORedis from "ioredis";
import { QUEUES, type AIRequestJob, type IncomingMessageJob, type OutgoingMessageJob, type WebhookProcessingJob, type WhatsAppStatusJob } from "./contracts";
import { DEFAULT_QUEUE_OPTIONS } from "./queue-options";

export * from "./contracts";
export * from "./queue-options";
export * from "./ids";
export * from "./ai-dispatch";
export * from "./outgoing-dispatch";
export * from "./status-dispatch";

export function createRedisConnection(url: string): IORedis {
  return new IORedis(url, { maxRetriesPerRequest: null });
}

const options = { defaultJobOptions: DEFAULT_QUEUE_OPTIONS };

export function createQueues(connection: IORedis) {
  return {
    webhook: new Queue<WebhookProcessingJob>(QUEUES.webhook, { connection, ...options }),
    incomingMessages: new Queue<IncomingMessageJob>(QUEUES.incomingMessages, { connection, ...options }),
    outgoingMessages: new Queue<OutgoingMessageJob>(QUEUES.outgoingMessages, { connection, ...options }),
    messageStatus: new Queue<WhatsAppStatusJob>(QUEUES.messageStatus, { connection, ...options }),
    ai: new Queue<AIRequestJob>(QUEUES.ai, { connection, ...options }),
  };
}

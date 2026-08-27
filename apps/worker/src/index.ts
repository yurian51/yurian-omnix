import { Worker } from "bullmq";
import { createRedisConnection, QUEUES } from "@omnix/queue";
import { processIncomingMessage } from "./message-worker";
import { processAIRequest } from "./ai-worker";
import { processOutgoingMessage } from "./outgoing-worker";
import { processWhatsAppStatus } from "./status-worker";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required for the OMNIX worker");
}

const connection = createRedisConnection(redisUrl);

export const incomingMessageWorker = new Worker(
  QUEUES.incomingMessages,
  processIncomingMessage,
  { connection, concurrency: 10 },
);

export const aiWorker = new Worker(
  QUEUES.ai,
  processAIRequest,
  { connection, concurrency: 5 },
);

export const outgoingMessageWorker = new Worker(
  QUEUES.outgoingMessages,
  processOutgoingMessage,
  { connection, concurrency: 10 },
);

export const messageStatusWorker = new Worker(
  QUEUES.messageStatus,
  processWhatsAppStatus,
  { connection, concurrency: 20 },
);

for (const [name, worker] of [
  ["incoming", incomingMessageWorker],
  ["ai", aiWorker],
  ["outgoing", outgoingMessageWorker],
  ["status", messageStatusWorker],
] as const) {
  worker.on("failed", (job, error) => {
    console.error(`OMNIX ${name} job failed`, {
      jobId: job?.id,
      error: error.message,
    });
  });
}

console.log("OMNIX workers started: incoming-message, ai, outgoing-message, message-status");

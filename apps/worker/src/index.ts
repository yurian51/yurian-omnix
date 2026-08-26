import { Worker } from "bullmq";
import { createRedisConnection, QUEUES } from "@omnix/queue";
import { processIncomingMessage } from "./message-worker";

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

incomingMessageWorker.on("failed", (job, error) => {
  console.error("OMNIX incoming message job failed", {
    jobId: job?.id,
    error: error.message,
  });
});

console.log("OMNIX incoming message worker started");

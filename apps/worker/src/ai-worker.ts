import type { Job } from "bullmq";
import type { AIRequestJob } from "@omnix/queue";

export type AIOrchestratorInput = {
  tenantId: string;
  conversationId: string;
  messageId: string;
};

export function buildAIOrchestratorInput(job: Job<AIRequestJob>): AIOrchestratorInput {
  return job.data;
}

export async function processAIRequest(job: Job<AIRequestJob>) {
  const input = buildAIOrchestratorInput(job);
  // Provider/model invocation is intentionally isolated behind this boundary.
  return { accepted: true, ...input };
}

import type { Job } from "bullmq";
import type { AIRequestJob } from "@omnix/queue";
import { AIOrchestrator, type AIModelAdapter, type AIOrchestratorRequest, type AITool } from "@omnix/ai";

export type AIOrchestratorInput = {
  tenantId: string;
  conversationId: string;
  messageId: string;
};

export type AIWorkerDependencies = {
  loadRequest: (input: AIOrchestratorInput) => Promise<AIOrchestratorRequest>;
  model: AIModelAdapter;
  tools: AITool[];
};

export function buildAIOrchestratorInput(job: Job<AIRequestJob>): AIOrchestratorInput {
  return job.data;
}

export function createAIWorkerProcessor(deps: AIWorkerDependencies) {
  const orchestrator = new AIOrchestrator(deps.model, deps.tools);
  return async (job: Job<AIRequestJob>) => {
    const input = buildAIOrchestratorInput(job);
    const request = await deps.loadRequest(input);
    return orchestrator.run(request);
  };
}

export async function processAIRequest(job: Job<AIRequestJob>) {
  return { accepted: true, ...buildAIOrchestratorInput(job) };
}

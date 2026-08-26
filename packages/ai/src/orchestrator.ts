import type { AIAction, AIOrchestratorRequest, AIOrchestratorResult } from "./types";
import type { AITool } from "./tools";

export type AIModelAdapter = {
  generate: (input: {
    system: string;
    messages: AIOrchestratorRequest["history"];
    input: string;
    tools: AITool[];
  }) => Promise<AIAction>;
};

export type OrchestratorPolicy = {
  minimumConfidence: number;
  allowAutomaticToolCalls: boolean;
};

export class AIOrchestrator {
  constructor(
    private readonly model: AIModelAdapter,
    private readonly tools: AITool[],
    private readonly policy: OrchestratorPolicy = {
      minimumConfidence: 0.7,
      allowAutomaticToolCalls: true,
    },
  ) {}

  async run(request: AIOrchestratorRequest): Promise<AIOrchestratorResult> {
    const system = this.buildSystemPrompt(request);
    const action = await this.model.generate({
      system,
      messages: request.history,
      input: request.input,
      tools: this.tools,
    });

    const confidence = action.type === "handoff" ? 0 : 1;
    if (confidence < this.policy.minimumConfidence) {
      return {
        action: { type: "handoff", reason: "AI confidence below configured threshold" },
        confidence,
      };
    }

    if (action.type === "tool_call" && !this.policy.allowAutomaticToolCalls) {
      return {
        action: { type: "handoff", reason: `Tool call requires human approval: ${action.tool}` },
        confidence,
      };
    }

    return { action, confidence };
  }

  private buildSystemPrompt(request: AIOrchestratorRequest): string {
    const knowledge = request.knowledge
      .map((item) => `[${item.title}] ${item.content}`)
      .join("\n");

    return [
      "You are an OMNIX business assistant.",
      "Use only available business context and authorized tools.",
      "Do not invent prices, stock, orders, payments, policies, or customer data.",
      "Escalate to a human when confidence is insufficient or an action requires approval.",
      `Customer: ${request.customer.name ?? "Customer"} (${request.customer.phone})`,
      `Lifecycle: ${request.customer.lifecycle}`,
      request.customer.memory.length ? `Memory:\n${request.customer.memory.join("\n")}` : "",
      knowledge ? `Knowledge:\n${knowledge}` : "",
    ].filter(Boolean).join("\n\n");
  }
}

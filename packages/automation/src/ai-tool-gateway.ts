import type { AIAgentDefinition, AgentTool } from "./ai-agent";
import { canUseTool } from "./ai-agent";

export type ToolRequest = { name: string; args: Record<string, unknown> };
export type ToolExecutionContext = { tenantId: string; agent: AIAgentDefinition; currentCalls: number };
export type ToolHandler = (args: Record<string, unknown>, context: ToolExecutionContext) => Promise<Record<string, unknown>>;

export class AIToolGateway {
  constructor(private readonly handlers: Record<string, ToolHandler>) {}

  async execute(request: ToolRequest, context: ToolExecutionContext) {
    if (context.tenantId !== context.agent.tenantId) throw new Error("Tenant mismatch");
    if (!canUseTool(context.agent, request.name, context.currentCalls)) throw new Error(`AI tool is not permitted: ${request.name}`);
    const handler = this.handlers[request.name];
    if (!handler) throw new Error(`AI tool handler is unavailable: ${request.name}`);
    return handler(request.args, context);
  }
}

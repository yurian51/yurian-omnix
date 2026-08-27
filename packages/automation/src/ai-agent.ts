import type { VariableDefinition } from "./variable-catalog";
import { variableCatalog } from "./variable-catalog";

export type AgentTool = { name: string; description: string; destructive?: boolean };
export type AIAgentDefinition = { id: string; tenantId: string; name: string; instructions: string; allowedTools: AgentTool[]; allowedVariables: string[]; maxToolCalls: number; humanHandoffThreshold?: number };
export type AgentContext = { tenantId: string; variables: Record<string, unknown>; conversation?: { id: string }; tools: AgentTool[] };

export function buildAgentContext(agent: AIAgentDefinition, input: Record<string, unknown>): AgentContext {
  if (!agent.tenantId || !input.tenantId || agent.tenantId !== String(input.tenantId)) throw new Error("Tenant mismatch");
  const allowed = new Set(variableCatalog.map((item) => item.path));
  const variables: Record<string, unknown> = {};
  for (const path of agent.allowedVariables) {
    if (!allowed.has(path)) throw new Error(`Unknown agent variable: ${path}`);
    const value = path.split(".").reduce((current: any, key) => current == null ? undefined : current[key], input);
    if (value !== undefined) variables[path] = value;
  }
  return { tenantId: agent.tenantId, variables, conversation: input.conversation as AgentContext["conversation"], tools: agent.allowedTools };
}

export function canUseTool(agent: AIAgentDefinition, toolName: string, currentCalls: number) {
  return currentCalls < Math.max(0, agent.maxToolCalls) && agent.allowedTools.some((tool) => tool.name === toolName);
}

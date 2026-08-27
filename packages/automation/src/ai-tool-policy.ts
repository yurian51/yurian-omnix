import type { AgentTool, AIAgentDefinition } from "./ai-agent";

export function authorizeAgentTool(agent: AIAgentDefinition, tool: AgentTool, callsUsed: number) {
  if (agent.maxToolCalls < 0 || callsUsed >= agent.maxToolCalls) throw new Error("AI tool call limit exceeded");
  const allowed = agent.allowedTools.some((candidate) => candidate.name === tool.name);
  if (!allowed) throw new Error(`AI agent is not allowed to use tool: ${tool.name}`);
  return true;
}

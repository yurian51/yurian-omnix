import type { AgentTool } from "./ai-agent";

export type ApprovalDecision = { required: boolean; reason: string };

export function evaluateToolApproval(tool: AgentTool, approvalRequiredTools: string[] = []): ApprovalDecision {
  if (tool.destructive) return { required: true, reason: "Destructive AI action requires human approval" };
  if (approvalRequiredTools.includes(tool.name)) return { required: true, reason: "Tool is configured to require human approval" };
  return { required: false, reason: "Tool is permitted without human approval" };
}

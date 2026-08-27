import type { AITool, AIToolContext } from "./tools";
import { requiresToolApproval } from "./policies";

export type ToolRunResult =
  | { status: "executed"; output: unknown }
  | { status: "approval_required"; tool: string };

export async function runTool(
  tool: AITool,
  context: AIToolContext,
  args: Record<string, unknown>,
  options: { approved?: boolean } = {},
): Promise<ToolRunResult> {
  if (requiresToolApproval(tool.name) && !options.approved) {
    return { status: "approval_required", tool: tool.name };
  }

  return { status: "executed", output: await tool.execute(context, args) };
}

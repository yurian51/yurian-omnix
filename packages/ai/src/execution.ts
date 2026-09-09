import type { AITool, AIToolContext } from "./tools";
import { runTool, type ToolRunResult } from "./tool-runner";
import { verifyToolOutput, type VerificationResult } from "./verification";

export type VerifiedExecution =
  | { status: "approval_required"; tool: string }
  | { status: "failed_verification"; tool: string; reason: string }
  | { status: "executed"; tool: string; output: unknown; verification: VerificationResult };

export async function executeAndVerify(
  tool: AITool,
  context: AIToolContext,
  args: Record<string, unknown>,
  options: { approved?: boolean } = {},
): Promise<VerifiedExecution> {
  const result: ToolRunResult = await runTool(tool, context, args, options);
  if (result.status === "approval_required") return result;

  const verification = verifyToolOutput(result.output);
  if (!verification.verified) {
    return { status: "failed_verification", tool: tool.name, reason: verification.reason };
  }

  return { status: "executed", tool: tool.name, output: result.output, verification };
}

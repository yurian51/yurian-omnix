import { evaluateConditions } from "./condition-engine";
import type { AutomationAction, AutomationWorkflow } from "./types";

export interface AutomationActionRunner { run(action: AutomationAction, context: Record<string, unknown>): Promise<unknown>; }

export class AutomationEngine {
  constructor(private readonly runner: AutomationActionRunner) {}

  async trigger(workflow: AutomationWorkflow, context: Record<string, unknown>) {
    if (!workflow.enabled) return { status: "DISABLED" as const };
    if (workflow.tenantId !== String(context.tenantId ?? "")) throw new Error("Tenant mismatch");
    if (!evaluateConditions(workflow.conditions, context)) return { status: "CONDITION_NOT_MET" as const };

    const results: unknown[] = [];
    for (const action of workflow.actions) {
      if (action.type === "WAIT") {
        const ms = Math.min(Math.max(Number(action.config.ms ?? 0), 0), 86_400_000);
        if (ms > 0) await new Promise((resolve) => setTimeout(resolve, ms));
        results.push({ waitedMs: ms });
        continue;
      }
      results.push(await this.runner.run(action, context));
    }
    return { status: "COMPLETED" as const, results };
  }
}

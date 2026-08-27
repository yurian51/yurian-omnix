import type { AutomationAction, AutomationWorkflow } from "./types";
import { evaluateConditions } from "./condition-engine";
import { validateWorkflow } from "./workflow-validator";

export type DryRunResult = { actionIndex: number; action: AutomationAction; wouldRun: boolean; reason?: string };

export function dryRunWorkflow(workflow: AutomationWorkflow, context: Record<string, unknown>): DryRunResult[] {
  validateWorkflow(workflow);
  if (workflow.tenantId !== String(context.tenantId ?? "")) throw new Error("Tenant mismatch");
  const conditionsMet = evaluateConditions(workflow.conditions, context);
  return workflow.actions.map((action, actionIndex) => ({
    actionIndex,
    action,
    wouldRun: conditionsMet,
    reason: conditionsMet ? undefined : "Workflow conditions are not satisfied",
  }));
}

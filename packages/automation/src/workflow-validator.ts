import type { AutomationWorkflow } from "./types";

const allowedTriggers = new Set(["EVENT", "COMMAND", "SCHEDULE", "WEBHOOK"]);
const allowedActions = new Set(["SEND_WHATSAPP", "RUN_COMMAND", "RUN_AI", "ASSIGN_AGENT", "CREATE_TICKET", "CREATE_ORDER", "ADD_TAG", "WAIT"]);

export function validateWorkflow(workflow: AutomationWorkflow): AutomationWorkflow {
  if (!workflow.id.trim() || !workflow.tenantId.trim() || !workflow.name.trim()) throw new Error("Workflow id, tenantId and name are required");
  if (!allowedTriggers.has(workflow.trigger.type)) throw new Error("Unsupported trigger type");
  if (!workflow.actions.length) throw new Error("Workflow must contain at least one action");
  for (const action of workflow.actions) if (!allowedActions.has(action.type)) throw new Error(`Unsupported action: ${action.type}`);
  return workflow;
}

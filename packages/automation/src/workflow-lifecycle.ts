import type { AutomationWorkflow } from "./types";
import { validateWorkflow } from "./workflow-validator";

export type WorkflowLifecycle = "DRAFT" | "ACTIVE" | "DISABLED" | "ARCHIVED";

export type ManagedWorkflow = AutomationWorkflow & { lifecycle: WorkflowLifecycle; version: number };

export function transitionWorkflow(workflow: ManagedWorkflow, target: WorkflowLifecycle): ManagedWorkflow {
  if (target === "ACTIVE") validateWorkflow(workflow);
  if (target === "ARCHIVED" && workflow.lifecycle === "ACTIVE") throw new Error("Disable an active workflow before archiving it");
  return { ...workflow, lifecycle: target };
}

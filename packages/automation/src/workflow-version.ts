import type { AutomationWorkflow } from "./types";

export type WorkflowVersion = { id: string; workflowId: string; tenantId: string; version: number; workflow: AutomationWorkflow; createdAt: string; createdBy: string };

export interface WorkflowVersionStore {
  create(input: Omit<WorkflowVersion, "createdAt">): Promise<WorkflowVersion>;
  list(workflowId: string, tenantId: string): Promise<WorkflowVersion[]>;
  get(workflowId: string, tenantId: string, version: number): Promise<WorkflowVersion | null>;
}

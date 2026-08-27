import type { AutomationWorkflow } from "./types";
import { validateWorkflow } from "./workflow-validator";

export interface AutomationWorkflowStore {
  save(workflow: AutomationWorkflow): Promise<AutomationWorkflow>;
  get(id: string, tenantId: string): Promise<AutomationWorkflow | null>;
  listByEvent(tenantId: string, event: string): Promise<AutomationWorkflow[]>;
}

export class ValidatingWorkflowStore {
  constructor(private readonly store: AutomationWorkflowStore) {}
  save(workflow: AutomationWorkflow) { return this.store.save(validateWorkflow(workflow)); }
  get(id: string, tenantId: string) { return this.store.get(id, tenantId); }
  listByEvent(tenantId: string, event: string) { return this.store.listByEvent(tenantId, event); }
}

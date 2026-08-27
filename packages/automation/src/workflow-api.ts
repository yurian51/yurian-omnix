import type { AutomationWorkflow } from "./types";
import type { AutomationWorkflowStore } from "./workflow-store";
import { validateWorkflow } from "./workflow-validator";

export class WorkflowApplicationService {
  constructor(private readonly store: AutomationWorkflowStore) {}

  create(workflow: AutomationWorkflow) { return this.store.save(validateWorkflow(workflow)); }
  get(id: string, tenantId: string) { return this.store.get(id, tenantId); }
  listForEvent(tenantId: string, event: string) { return this.store.listByEvent(tenantId, event); }
}

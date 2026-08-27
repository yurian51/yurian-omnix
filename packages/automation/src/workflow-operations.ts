import type { AutomationWorkflow } from "./types";
import type { AutomationWorkflowStore } from "./workflow-store";
import { validateWorkflow } from "./workflow-validator";

export interface ManagedWorkflowStore extends AutomationWorkflowStore {
  update(workflow: AutomationWorkflow): Promise<AutomationWorkflow>;
  delete(id: string, tenantId: string): Promise<void>;
}

export class WorkflowOperations {
  constructor(private readonly store: ManagedWorkflowStore) {}

  async update(workflow: AutomationWorkflow) {
    return this.store.update(validateWorkflow(workflow));
  }

  async remove(id: string, tenantId: string) {
    const workflow = await this.store.get(id, tenantId);
    if (!workflow) throw new Error("Workflow not found");
    await this.store.delete(id, tenantId);
  }

  async duplicate(id: string, tenantId: string, name: string) {
    const source = await this.store.get(id, tenantId);
    if (!source) throw new Error("Workflow not found");
    return this.store.save(validateWorkflow({ ...source, id: `${source.id}:copy:${Date.now()}`, name, enabled: false }));
  }
}

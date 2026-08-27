import type { WorkflowNodeType } from "./workflow-graph";

export type WorkflowNodeDefinition = { type: WorkflowNodeType; label: string; description: string; configurable: boolean };

export const workflowNodeDefinitions: WorkflowNodeDefinition[] = [
  ["TRIGGER","Trigger","Starts a workflow from an event, command, schedule or webhook",true],
  ["CONDITION","Condition","Controls whether a branch continues",true],
  ["AI","AI Agent","Run an AI instruction or agent",true],
  ["COMMAND","Command","Execute a governed OMNIX command",true],
  ["WHATSAPP","WhatsApp","Send or manage WhatsApp operations",true],
  ["WAIT","Wait","Pause execution until a scheduled resume",true],
  ["HTTP","HTTP Request","Call an approved external HTTP endpoint",true],
  ["TICKET","Ticket","Create or update a support ticket",true],
  ["ORDER","Order","Create or update a sales order",true],
  ["TAG","Tag","Add a customer or conversation tag",true],
  ["ASSIGN_AGENT","Assign Agent","Route work to a human agent",true],
  ["END","End","Finish workflow execution",false],
].map(([type,label,description,configurable]) => ({ type: type as WorkflowNodeType, label, description, configurable }));

export class WorkflowNodeRegistry {
  private readonly definitions = new Map(workflowNodeDefinitions.map((node) => [node.type, node]));
  get(type: WorkflowNodeType) { return this.definitions.get(type); }
  list() { return [...this.definitions.values()]; }
}

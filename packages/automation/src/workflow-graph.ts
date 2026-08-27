import type { ActionType, AutomationCondition, AutomationTrigger } from "./types";

export type WorkflowNodeType = "TRIGGER" | "CONDITION" | "AI" | "COMMAND" | "WHATSAPP" | "WAIT" | "HTTP" | "TICKET" | "ORDER" | "TAG" | "ASSIGN_AGENT" | "END";
export type WorkflowNode = { id: string; type: WorkflowNodeType; position: { x: number; y: number }; config: Record<string, unknown> };
export type WorkflowEdge = { id: string; source: string; target: string; label?: string };
export type WorkflowGraph = { nodes: WorkflowNode[]; edges: WorkflowEdge[] };

const allowedTypes = new Set<WorkflowNodeType>(["TRIGGER","CONDITION","AI","COMMAND","WHATSAPP","WAIT","HTTP","TICKET","ORDER","TAG","ASSIGN_AGENT","END"]);

export function validateWorkflowGraph(graph: WorkflowGraph): WorkflowGraph {
  if (!graph.nodes.length) throw new Error("Workflow graph requires nodes");
  if (!graph.nodes.some((node) => node.type === "TRIGGER")) throw new Error("Workflow graph requires a trigger node");
  if (!graph.nodes.some((node) => node.type === "END")) throw new Error("Workflow graph requires an end node");
  const ids = new Set<string>();
  for (const node of graph.nodes) {
    if (!node.id || ids.has(node.id)) throw new Error("Workflow node IDs must be unique");
    if (!allowedTypes.has(node.type)) throw new Error(`Unsupported workflow node type: ${node.type}`);
    ids.add(node.id);
  }
  for (const edge of graph.edges) {
    if (!ids.has(edge.source) || !ids.has(edge.target)) throw new Error("Workflow edge references an unknown node");
    if (edge.source === edge.target) throw new Error("Workflow node cannot connect to itself");
  }
  return graph;
}

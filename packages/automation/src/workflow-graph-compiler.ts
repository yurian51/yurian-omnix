import type { AutomationAction, AutomationWorkflow, AutomationTrigger, AutomationCondition } from "./types";
import type { WorkflowGraph, WorkflowNode } from "./workflow-graph";
import { validateWorkflowGraph } from "./workflow-graph";

export function compileWorkflowGraph(input: { id: string; tenantId: string; name: string; enabled?: boolean; graph: WorkflowGraph }): AutomationWorkflow {
  const graph = validateWorkflowGraph(input.graph);
  const triggerNode = graph.nodes.find((node) => node.type === "TRIGGER")!;
  const trigger = triggerNode.config as unknown as AutomationTrigger;
  const conditions = graph.nodes.filter((node) => node.type === "CONDITION").map((node) => node.config as unknown as AutomationCondition);
  const ordered = topologicalNodes(graph.nodes, graph.edges);
  const actions = ordered.filter((node) => node.type !== "TRIGGER" && node.type !== "CONDITION" && node.type !== "END").map(toAction);
  return { id: input.id, tenantId: input.tenantId, name: input.name, enabled: input.enabled ?? false, trigger, conditions, actions };
}

function toAction(node: WorkflowNode): AutomationAction {
  const map: Record<string, AutomationAction["type"]> = { AI: "RUN_AI", COMMAND: "RUN_COMMAND", WHATSAPP: "SEND_WHATSAPP", TICKET: "CREATE_TICKET", ORDER: "CREATE_ORDER", TAG: "ADD_TAG", ASSIGN_AGENT: "ASSIGN_AGENT", WAIT: "WAIT", HTTP: "RUN_COMMAND" };
  const type = map[node.type];
  if (!type) throw new Error(`Node ${node.id} cannot be compiled as an action`);
  return { type, config: node.config };
}

function topologicalNodes(nodes: WorkflowNode[], edges: { source: string; target: string }[]) {
  const incoming = new Map(nodes.map((n) => [n.id, 0]));
  const outgoing = new Map<string, string[]>();
  for (const edge of edges) { incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1); outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target]); }
  const queue = nodes.filter((n) => incoming.get(n.id) === 0).map((n) => n.id);
  const result: WorkflowNode[] = [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  while (queue.length) { const id = queue.shift()!; result.push(byId.get(id)!); for (const next of outgoing.get(id) ?? []) { incoming.set(next, incoming.get(next)! - 1); if (incoming.get(next) === 0) queue.push(next); } }
  if (result.length !== nodes.length) throw new Error("Workflow graph contains a cycle");
  return result;
}

export type VariableNamespace = "customer" | "contact" | "conversation" | "message" | "order" | "payment" | "ticket" | "group" | "agent" | "company" | "workflow" | "execution" | "date";

export type VariableDefinition = { path: string; namespace: VariableNamespace; description: string; sensitive?: boolean };

export const variableCatalog: VariableDefinition[] = [
  { path: "customer.id", namespace: "customer", description: "Customer identifier" },
  { path: "customer.name", namespace: "customer", description: "Customer display name" },
  { path: "customer.phone", namespace: "customer", description: "Customer WhatsApp phone", sensitive: true },
  { path: "message.text", namespace: "message", description: "Inbound message text" },
  { path: "message.id", namespace: "message", description: "Message identifier" },
  { path: "conversation.id", namespace: "conversation", description: "Conversation identifier" },
  { path: "order.id", namespace: "order", description: "Order identifier" },
  { path: "order.total", namespace: "order", description: "Order total" },
  { path: "payment.status", namespace: "payment", description: "Payment status" },
  { path: "ticket.id", namespace: "ticket", description: "Ticket identifier" },
  { path: "ticket.status", namespace: "ticket", description: "Ticket status" },
  { path: "group.id", namespace: "group", description: "WhatsApp group identifier" },
  { path: "agent.id", namespace: "agent", description: "Assigned agent identifier" },
  { path: "company.id", namespace: "company", description: "Business tenant identifier" },
  { path: "workflow.id", namespace: "workflow", description: "Current workflow identifier" },
  { path: "execution.id", namespace: "execution", description: "Current execution identifier" },
  { path: "date.iso", namespace: "date", description: "Current ISO timestamp" },
];

export function listVariables(namespace?: VariableNamespace) {
  return namespace ? variableCatalog.filter((variable) => variable.namespace === namespace) : [...variableCatalog];
}

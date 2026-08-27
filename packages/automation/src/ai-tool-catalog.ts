import type { AgentTool } from "./ai-agent";

export const aiBusinessTools: AgentTool[] = [
  { name: "customer.get", description: "Read a customer within the current tenant" },
  { name: "customer.update", description: "Update an allowed customer field" },
  { name: "product.search", description: "Search products available to the business" },
  { name: "order.get", description: "Read an order within the current tenant" },
  { name: "order.create", description: "Create a sales order" },
  { name: "order.update", description: "Update an allowed order field" },
  { name: "payment.get", description: "Read payment status" },
  { name: "ticket.create", description: "Create a support ticket" },
  { name: "ticket.assign", description: "Assign a support ticket" },
  { name: "whatsapp.send", description: "Send a WhatsApp message" },
  { name: "whatsapp.template.send", description: "Send an approved WhatsApp template" },
  { name: "group.get", description: "Read a WhatsApp group" },
  { name: "group.create", description: "Create a WhatsApp group" },
  { name: "group.update", description: "Update an allowed group setting" },
  { name: "group.delete", description: "Delete a WhatsApp group", destructive: true },
  { name: "group.member.add", description: "Add a member to a WhatsApp group" },
  { name: "group.member.remove", description: "Remove a member from a WhatsApp group" },
];

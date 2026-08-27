import type { CommandDefinition } from "./types";

export const standardCommands: CommandDefinition[] = [
  { name: "help", aliases: ["help", "msaada"], description: "Show available commands", category: "SYSTEM", execute: async () => ({ action: "HELP" }) },
  { name: "menu", aliases: ["menu"], description: "Show the business menu", category: "CUSTOMER", execute: async () => ({ action: "MENU" }) },
  { name: "products.list", aliases: ["products", "bidhaa"], description: "List products", category: "CUSTOMER", permission: "inbox.read", execute: async () => ({ action: "LIST_PRODUCTS" }) },
  { name: "orders.list", aliases: ["orders", "oda"], description: "List customer orders", category: "CUSTOMER", permission: "orders.read", execute: async () => ({ action: "LIST_ORDERS" }) },
  { name: "support", aliases: ["support", "msaada"], description: "Open support", category: "CUSTOMER", permission: "inbox.read", execute: async () => ({ action: "SUPPORT" }) },
  { name: "human", aliases: ["human", "agent", "mhudumu"], description: "Request a human agent", category: "CUSTOMER", execute: async () => ({ action: "HUMAN_HANDOFF" }) },
  { name: "group.create", aliases: ["group create", "create-group"], description: "Create a WhatsApp group", category: "GROUP", permission: "whatsapp.groups.create", requiresApproval: true, args: [{ name: "name", type: "string", required: true }], execute: async (args) => ({ action: "GROUP_CREATE", name: args.name }) },
  { name: "group.delete", aliases: ["group delete", "delete-group"], description: "Delete a WhatsApp group", category: "GROUP", permission: "whatsapp.groups.delete", requiresApproval: true, destructive: true, args: [{ name: "groupId", type: "string", required: true }], execute: async (args) => ({ action: "GROUP_DELETE", groupId: args.groupId }) },
];

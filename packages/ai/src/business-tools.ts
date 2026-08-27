import type { AITool } from "./tools";

export type BusinessToolServices = {
  searchProducts: (tenantId: string, query: string) => Promise<unknown>;
  getProduct: (tenantId: string, productId: string) => Promise<unknown>;
  getCustomer: (tenantId: string, contactId: string) => Promise<unknown>;
  getOrder: (tenantId: string, orderId: string) => Promise<unknown>;
  createOrder: (tenantId: string, contactId: string, args: Record<string, unknown>) => Promise<unknown>;
  createSupportTicket: (tenantId: string, contactId: string, args: Record<string, unknown>) => Promise<unknown>;
  handoffToAgent: (tenantId: string, conversationId: string, reason: string) => Promise<unknown>;
};

function requiredString(args: Record<string, unknown>, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`Missing required argument: ${key}`);
  return value.trim();
}

export function createBusinessTools(services: BusinessToolServices): AITool[] {
  return [
    {
      name: "search_products",
      description: "Search products available to the current tenant.",
      execute: (ctx, args) => services.searchProducts(ctx.tenantId, requiredString(args, "query")),
    },
    {
      name: "get_product",
      description: "Get a product by ID.",
      execute: (ctx, args) => services.getProduct(ctx.tenantId, requiredString(args, "productId")),
    },
    {
      name: "get_customer",
      description: "Get the current customer's business profile.",
      execute: (ctx) => services.getCustomer(ctx.tenantId, ctx.contactId),
    },
    {
      name: "get_order",
      description: "Get an order by ID.",
      execute: (ctx, args) => services.getOrder(ctx.tenantId, requiredString(args, "orderId")),
    },
    {
      name: "create_order",
      description: "Create a customer order. This is a financial action and requires approval.",
      execute: (ctx, args) => services.createOrder(ctx.tenantId, ctx.contactId, args),
    },
    {
      name: "create_support_ticket",
      description: "Create a customer support ticket.",
      execute: (ctx, args) => services.createSupportTicket(ctx.tenantId, ctx.contactId, args),
    },
    {
      name: "handoff_to_agent",
      description: "Hand the conversation to a human agent.",
      execute: (ctx, args) => services.handoffToAgent(ctx.tenantId, ctx.conversationId, requiredString(args, "reason")),
    },
  ];
}

import type { CustomerService } from "../../crm/src/services";
import type { OrderService, PaymentService, ProductService, TicketService } from "../../commerce/src/services";
import type { ToolHandler } from "./ai-tool-gateway";

export function createBusinessToolHandlers(deps: { customers: CustomerService; products: ProductService; orders: OrderService; payments: PaymentService; tickets: TicketService }): Record<string, ToolHandler> {
  return {
    "customer.get": async (args, ctx) => ({ customer: await deps.customers.get(ctx.tenantId, String(args.id)) }),
    "customer.update": async (args, ctx) => ({ customer: await deps.customers.update(ctx.tenantId, String(args.id), { name: args.name as string | undefined, phone: args.phone as string | undefined, email: args.email as string | undefined, status: args.status as any }) }),
    "product.search": async (args, ctx) => ({ products: await deps.products.search(ctx.tenantId, String(args.query ?? "")) }),
    "order.get": async (args, ctx) => ({ order: await deps.orders.get(ctx.tenantId, String(args.id)) }),
    "order.create": async (args, ctx) => ({ order: await deps.orders.create({ tenantId: ctx.tenantId, customerId: String(args.customerId), items: Array.isArray(args.items) ? args.items as { productId: string; quantity: number }[] : [] }) }),
    "order.update": async (args, ctx) => ({ order: await deps.orders.update(ctx.tenantId, String(args.id), { status: args.status as any }) }),
    "payment.get": async (args, ctx) => ({ payment: args.orderId ? await deps.payments.getByOrder(ctx.tenantId, String(args.orderId)) : await deps.payments.get(ctx.tenantId, String(args.id)) }),
    "ticket.create": async (args, ctx) => ({ ticket: await deps.tickets.create({ tenantId: ctx.tenantId, customerId: String(args.customerId), title: String(args.title), priority: args.priority as any }) }),
    "ticket.assign": async (args, ctx) => ({ ticket: await deps.tickets.assign(ctx.tenantId, String(args.id), String(args.agentId)) }),
  };
}

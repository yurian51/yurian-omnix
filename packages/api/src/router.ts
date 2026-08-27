export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
export type RouteDefinition = { method: HttpMethod; path: string; permission?: string; handler: string };
export const routes: readonly RouteDefinition[] = [
  { method: "GET", path: "/api/v1/customers/:id", permission: "customers:read", handler: "customers.get" },
  { method: "GET", path: "/api/v1/products", permission: "products:read", handler: "products.search" },
  { method: "POST", path: "/api/v1/orders", permission: "orders:write", handler: "orders.create" },
  { method: "GET", path: "/api/v1/orders/:id", permission: "orders:read", handler: "orders.get" },
  { method: "PATCH", path: "/api/v1/orders/:id", permission: "orders:write", handler: "orders.update" },
  { method: "GET", path: "/api/v1/payments/:id", permission: "payments:read", handler: "payments.get" },
  { method: "POST", path: "/api/v1/tickets", permission: "tickets:write", handler: "tickets.create" },
  { method: "POST", path: "/api/v1/whatsapp/webhook", handler: "whatsapp.webhook" }
];

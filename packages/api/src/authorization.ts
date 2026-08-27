export function requirePermission(permissions: readonly string[], required: string) {
  if (!permissions.includes(required) && !permissions.includes("*")) throw new Error(`Missing permission: ${required}`);
}

export const API_PERMISSIONS = {
  customersRead: "customers:read",
  customersWrite: "customers:write",
  productsRead: "products:read",
  ordersRead: "orders:read",
  ordersWrite: "orders:write",
  paymentsRead: "payments:read",
  ticketsWrite: "tickets:write",
  whatsappWrite: "whatsapp:write"
} as const;

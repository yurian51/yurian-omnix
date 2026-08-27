export type Role = "OWNER" | "ADMIN" | "SUPERVISOR" | "AGENT" | "VIEWER";

export type Permission =
  | "inbox.read"
  | "inbox.reply"
  | "inbox.assign"
  | "inbox.manage"
  | "orders.read"
  | "orders.create"
  | "customers.read"
  | "customers.manage"
  | "settings.manage"
  | "billing.manage"
  | "analytics.read";

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  OWNER: ["inbox.read","inbox.reply","inbox.assign","inbox.manage","orders.read","orders.create","customers.read","customers.manage","settings.manage","billing.manage","analytics.read"],
  ADMIN: ["inbox.read","inbox.reply","inbox.assign","inbox.manage","orders.read","orders.create","customers.read","customers.manage","settings.manage","analytics.read"],
  SUPERVISOR: ["inbox.read","inbox.reply","inbox.assign","inbox.manage","orders.read","orders.create","customers.read","customers.manage","analytics.read"],
  AGENT: ["inbox.read","inbox.reply","orders.read","orders.create","customers.read"],
  VIEWER: ["inbox.read","orders.read","customers.read","analytics.read"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

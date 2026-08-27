export type Role = "OWNER" | "ADMIN" | "SUPERVISOR" | "AGENT" | "VIEWER";

export type Permission =
  | "inbox.read" | "inbox.reply" | "inbox.assign" | "inbox.manage"
  | "orders.read" | "orders.create"
  | "customers.read" | "customers.manage"
  | "settings.manage" | "billing.manage" | "analytics.read"
  | "whatsapp.read" | "whatsapp.send"
  | "whatsapp.groups.read" | "whatsapp.groups.create" | "whatsapp.groups.manage"
  | "whatsapp.groups.invite" | "whatsapp.groups.remove" | "whatsapp.groups.delete"
  | "commands.execute" | "commands.approve";

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  OWNER: ["inbox.read","inbox.reply","inbox.assign","inbox.manage","orders.read","orders.create","customers.read","customers.manage","settings.manage","billing.manage","analytics.read","whatsapp.read","whatsapp.send","whatsapp.groups.read","whatsapp.groups.create","whatsapp.groups.manage","whatsapp.groups.invite","whatsapp.groups.remove","whatsapp.groups.delete","commands.execute","commands.approve"],
  ADMIN: ["inbox.read","inbox.reply","inbox.assign","inbox.manage","orders.read","orders.create","customers.read","customers.manage","settings.manage","analytics.read","whatsapp.read","whatsapp.send","whatsapp.groups.read","whatsapp.groups.create","whatsapp.groups.manage","whatsapp.groups.invite","whatsapp.groups.remove","whatsapp.groups.delete","commands.execute","commands.approve"],
  SUPERVISOR: ["inbox.read","inbox.reply","inbox.assign","inbox.manage","orders.read","orders.create","customers.read","customers.manage","analytics.read","whatsapp.read","whatsapp.send","whatsapp.groups.read","whatsapp.groups.manage","commands.execute"],
  AGENT: ["inbox.read","inbox.reply","orders.read","orders.create","customers.read","whatsapp.read","whatsapp.send","commands.execute"],
  VIEWER: ["inbox.read","orders.read","customers.read","analytics.read"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function permissionsForRole(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

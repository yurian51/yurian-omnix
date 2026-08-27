import type { CommandDefinition } from "./types";

export type Capability =
  | "GROUPS" | "GROUP_CREATE" | "GROUP_MANAGEMENT" | "GROUP_INVITES" | "GROUP_MESSAGING";

export type CapabilityResolver = (tenantId: string, phoneNumberId: string) => Promise<readonly Capability[]>;

export async function assertCommandCapability(command: CommandDefinition, tenantId: string, phoneNumberId: string, resolve: CapabilityResolver) {
  const capabilities = await resolve(tenantId, phoneNumberId);
  const required = command.name.startsWith("group.")
    ? command.name === "group.create" ? "GROUP_CREATE" : "GROUPS"
    : undefined;
  if (required && !capabilities.includes(required)) throw new Error(`WhatsApp capability unavailable: ${required}`);
}

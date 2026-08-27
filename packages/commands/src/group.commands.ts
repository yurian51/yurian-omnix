import type { CommandDefinition } from "./types";
import type { WhatsAppGroupService, GroupAction } from "@omnix/whatsapp";

export function createGroupCommands(groups: WhatsAppGroupService): CommandDefinition[] {
  const run = (action: GroupAction) => async (args: Record<string, unknown>, context: any) => groups.execute(action, { tenantId: context.tenantId, phoneNumberId: String(args.phoneNumberId ?? context.phoneNumberId ?? ""), groupId: args.groupId ? String(args.groupId) : undefined, actorUserId: context.userId }, args);
  return [
    { name: "group.create", aliases: ["group create", "create-group"], description: "Create a WhatsApp group", category: "GROUP", permission: "whatsapp.groups.create", requiresApproval: true, args: [{ name: "name", type: "string", required: true }], execute: run("CREATE") },
    { name: "group.info", aliases: ["group info"], description: "Get group information", category: "GROUP", permission: "whatsapp.groups.read", args: [{ name: "groupId", type: "string", required: true }], execute: run("INFO") },
    { name: "group.members", aliases: ["group members"], description: "List group members", category: "GROUP", permission: "whatsapp.groups.read", args: [{ name: "groupId", type: "string", required: true }], execute: run("MEMBERS") },
    { name: "group.invite", aliases: ["group invite"], description: "Invite a group member", category: "GROUP", permission: "whatsapp.groups.invite", args: [{ name: "groupId", type: "string", required: true }, { name: "phone", type: "string", required: true }], execute: run("INVITE") },
    { name: "group.remove", aliases: ["group remove"], description: "Remove a group member", category: "GROUP", permission: "whatsapp.groups.remove", requiresApproval: true, args: [{ name: "groupId", type: "string", required: true }, { name: "phone", type: "string", required: true }], execute: run("REMOVE") },
    { name: "group.ban", aliases: ["group ban"], description: "Ban a group member", category: "GROUP", permission: "whatsapp.groups.manage", requiresApproval: true, args: [{ name: "groupId", type: "string", required: true }, { name: "phone", type: "string", required: true }], execute: run("BAN") },
    { name: "group.unban", aliases: ["group unban"], description: "Unban a group member", category: "GROUP", permission: "whatsapp.groups.manage", args: [{ name: "groupId", type: "string", required: true }, { name: "phone", type: "string", required: true }], execute: run("UNBAN") },
    { name: "group.promote", aliases: ["group promote"], description: "Promote member to admin", category: "GROUP", permission: "whatsapp.groups.manage", requiresApproval: true, args: [{ name: "groupId", type: "string", required: true }, { name: "phone", type: "string", required: true }], execute: run("PROMOTE") },
    { name: "group.demote", aliases: ["group demote"], description: "Demote group admin", category: "GROUP", permission: "whatsapp.groups.manage", requiresApproval: true, args: [{ name: "groupId", type: "string", required: true }, { name: "phone", type: "string", required: true }], execute: run("DEMOTE") },
    { name: "group.rename", aliases: ["group rename"], description: "Rename a group", category: "GROUP", permission: "whatsapp.groups.manage", requiresApproval: true, args: [{ name: "groupId", type: "string", required: true }, { name: "name", type: "string", required: true }], execute: run("RENAME") },
    { name: "group.settings", aliases: ["group settings"], description: "Update group settings", category: "GROUP", permission: "whatsapp.groups.manage", requiresApproval: true, args: [{ name: "groupId", type: "string", required: true }], execute: run("SETTINGS") },
    { name: "group.delete", aliases: ["group delete", "delete-group"], description: "Delete a WhatsApp group", category: "GROUP", permission: "whatsapp.groups.delete", requiresApproval: true, destructive: true, args: [{ name: "groupId", type: "string", required: true }], execute: run("DELETE") },
  ];
}

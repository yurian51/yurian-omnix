import type { WhatsAppProvider } from "./types";

export type GroupAction =
  | "CREATE" | "INFO" | "MEMBERS" | "INVITE" | "REMOVE"
  | "BAN" | "UNBAN" | "PROMOTE" | "DEMOTE" | "RENAME" | "SETTINGS" | "DELETE";

export type GroupCommandContext = {
  tenantId: string;
  phoneNumberId: string;
  groupId?: string;
  actorUserId: string;
};

export class WhatsAppGroupService {
  constructor(private readonly provider: WhatsAppProvider) {}

  async execute(action: GroupAction, context: GroupCommandContext, args: Record<string, unknown>) {
    if (!context.tenantId || !context.phoneNumberId) throw new Error("WhatsApp tenant context is required");
    if (action !== "CREATE" && !context.groupId) throw new Error("groupId is required");
    switch (action) {
      case "CREATE": return this.provider.createGroup(context.phoneNumberId, String(args.name ?? ""));
      case "INFO": return this.provider.getGroup(context.phoneNumberId, context.groupId!);
      case "MEMBERS": return this.provider.listGroupMembers(context.phoneNumberId, context.groupId!);
      case "INVITE": return this.provider.inviteGroupMember(context.phoneNumberId, context.groupId!, String(args.phone));
      case "REMOVE": return this.provider.removeGroupMember(context.phoneNumberId, context.groupId!, String(args.phone));
      case "BAN": return this.provider.banGroupMember(context.phoneNumberId, context.groupId!, String(args.phone));
      case "UNBAN": return this.provider.unbanGroupMember(context.phoneNumberId, context.groupId!, String(args.phone));
      case "PROMOTE": return this.provider.promoteGroupAdmin(context.phoneNumberId, context.groupId!, String(args.phone));
      case "DEMOTE": return this.provider.demoteGroupAdmin(context.phoneNumberId, context.groupId!, String(args.phone));
      case "RENAME": return this.provider.renameGroup(context.phoneNumberId, context.groupId!, String(args.name));
      case "SETTINGS": return this.provider.updateGroupSettings(context.phoneNumberId, context.groupId!, args);
      case "DELETE": return this.provider.deleteGroup(context.phoneNumberId, context.groupId!);
    }
  }
}

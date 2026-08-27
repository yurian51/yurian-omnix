export interface WhatsAppGroupProvider {
  createGroup(phoneNumberId: string, name: string): Promise<unknown>;
  getGroup(phoneNumberId: string, groupId: string): Promise<unknown>;
  listGroupMembers(phoneNumberId: string, groupId: string): Promise<unknown>;
  inviteGroupMember(phoneNumberId: string, groupId: string, phone: string): Promise<unknown>;
  removeGroupMember(phoneNumberId: string, groupId: string, phone: string): Promise<unknown>;
  banGroupMember(phoneNumberId: string, groupId: string, phone: string): Promise<unknown>;
  unbanGroupMember(phoneNumberId: string, groupId: string, phone: string): Promise<unknown>;
  promoteGroupAdmin(phoneNumberId: string, groupId: string, phone: string): Promise<unknown>;
  demoteGroupAdmin(phoneNumberId: string, groupId: string, phone: string): Promise<unknown>;
  renameGroup(phoneNumberId: string, groupId: string, name: string): Promise<unknown>;
  updateGroupSettings(phoneNumberId: string, groupId: string, settings: Record<string, unknown>): Promise<unknown>;
  deleteGroup(phoneNumberId: string, groupId: string): Promise<unknown>;
}

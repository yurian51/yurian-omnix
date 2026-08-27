import type { PrismaClient } from "@prisma/client";

export class ConversationActionsService {
  constructor(private readonly db: PrismaClient) {}

  async assign(tenantId: string, conversationId: string, agentId: string | null) {
    return this.db.conversation.updateMany({ where: { id: conversationId, tenantId }, data: { assignedAgentId: agentId } });
  }

  async setMode(tenantId: string, conversationId: string, mode: "AI" | "HUMAN" | "HYBRID") {
    return this.db.conversation.updateMany({ where: { id: conversationId, tenantId }, data: { mode } });
  }

  async setStatus(tenantId: string, conversationId: string, status: "OPEN" | "CLOSED" | "PENDING") {
    return this.db.conversation.updateMany({ where: { id: conversationId, tenantId }, data: { status } });
  }

  async markRead(tenantId: string, conversationId: string) {
    return this.db.conversation.updateMany({ where: { id: conversationId, tenantId }, data: { unreadCount: 0 } });
  }
}

import type { PrismaClient } from "@prisma/client";

export type InboxFilters = {
  status?: "OPEN" | "CLOSED" | "PENDING";
  mode?: "AI" | "HUMAN" | "HYBRID";
  assignedAgentId?: string;
  search?: string;
};

export class InboxService {
  constructor(private readonly db: PrismaClient) {}

  async listConversations(tenantId: string, filters: InboxFilters = {}, page = 1, pageSize = 50) {
    const where: any = { tenantId };
    if (filters.status) where.status = filters.status;
    if (filters.mode) where.mode = filters.mode;
    if (filters.assignedAgentId) where.assignedAgentId = filters.assignedAgentId;
    if (filters.search) {
      where.contact = { OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search } },
      ] };
    }

    const [items, total] = await this.db.$transaction([
      this.db.conversation.findMany({
        where,
        include: { contact: true, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
        orderBy: { updatedAt: "desc" },
        skip: Math.max(0, page - 1) * pageSize,
        take: pageSize,
      }),
      this.db.conversation.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getConversation(tenantId: string, conversationId: string) {
    return this.db.conversation.findFirst({
      where: { id: conversationId, tenantId },
      include: { contact: true, messages: { orderBy: { createdAt: "asc" } } },
    });
  }
}

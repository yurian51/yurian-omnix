import type { PrismaClient } from "@prisma/client";

export class ConversationNoteService {
  constructor(private readonly db: PrismaClient) {}

  async add(tenantId: string, conversationId: string, authorId: string, content: string) {
    if (!content.trim()) throw new Error("Note content is required");
    return this.db.conversationNote.create({ data: { tenantId, conversationId, authorId, content: content.trim() } });
  }
}

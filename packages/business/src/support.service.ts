import type { PrismaClient } from "@prisma/client";

export class SupportService {
  constructor(private readonly db: PrismaClient) {}

  async createTicket(tenantId: string, contactId: string, input: { subject: string; description: string; category?: string; priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT" }) {
    return this.db.ticket.create({
      data: {
        tenantId,
        contactId,
        subject: input.subject,
        description: input.description,
        category: input.category ?? "GENERAL",
        priority: input.priority ?? "NORMAL",
      },
    });
  }
}

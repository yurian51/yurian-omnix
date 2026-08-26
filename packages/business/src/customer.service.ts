import type { PrismaClient } from "@prisma/client";

export class CustomerService {
  constructor(private readonly db: PrismaClient) {}

  async getCustomer(tenantId: string, contactId: string) {
    return this.db.contact.findFirst({
      where: { id: contactId, tenantId },
      include: { tags: { include: { tag: true } }, memories: { take: 20, orderBy: { createdAt: "desc" } } },
    });
  }
}

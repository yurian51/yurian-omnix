import type { PrismaClient } from "@prisma/client";

export class WhatsAppPhoneRepository {
  constructor(private readonly db: PrismaClient) {}

  async findTenantByPhoneNumberId(phoneNumberId: string) {
    return this.db.whatsAppPhone.findUnique({
      where: { phoneNumberId },
      select: { id: true, phoneNumberId: true, whatsappAccount: { select: { tenantId: true } } },
    });
  }
}

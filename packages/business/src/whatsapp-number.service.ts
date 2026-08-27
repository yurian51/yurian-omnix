import type { PrismaClient } from "@prisma/client";
import { validateWhatsAppRegistration, type WhatsAppNumberRegistration } from "@omnix/whatsapp";

export class WhatsAppNumberService {
  constructor(private readonly db: PrismaClient) {}

  async register(input: WhatsAppNumberRegistration) {
    validateWhatsAppRegistration(input);
    const tenant = await this.db.tenant.findUnique({ where: { id: input.tenantId }, select: { id: true } });
    if (!tenant) throw new Error("Tenant not found");
    return this.db.whatsAppAccount.upsert({
      where: { phoneNumberId: input.phoneNumberId },
      create: { tenantId: input.tenantId, phoneNumberId: input.phoneNumberId, businessAccountId: input.businessAccountId, displayPhoneNumber: input.displayPhoneNumber },
      update: { tenantId: input.tenantId, businessAccountId: input.businessAccountId, displayPhoneNumber: input.displayPhoneNumber },
    });
  }
}

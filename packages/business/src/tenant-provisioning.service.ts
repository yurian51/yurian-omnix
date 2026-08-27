import type { PrismaClient } from "@prisma/client";
import { validateOnboardingInput, type OnboardBusinessInput, type OnboardBusinessResult } from "@omnix/auth";

export class TenantProvisioningService {
  constructor(private readonly db: PrismaClient) {}

  async provision(input: OnboardBusinessInput): Promise<OnboardBusinessResult> {
    const data = validateOnboardingInput(input);
    const tenant = await this.db.$transaction(async (tx) => {
      const createdTenant = await tx.tenant.create({ data: { name: data.businessName, plan: data.plan } });
      await tx.tenantMember.create({ data: { tenantId: createdTenant.id, userId: data.ownerUserId, role: "OWNER" } });
      await tx.team.create({ data: { tenantId: createdTenant.id, name: "Default Team" } });
      return createdTenant;
    });
    return { tenantId: tenant.id, ownerUserId: data.ownerUserId, plan: data.plan };
  }
}

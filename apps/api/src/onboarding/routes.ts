import type { TenantProvisioningService } from "@omnix/business";
import type { AuthContext } from "@omnix/auth";

export function createOnboardingHandlers(service: TenantProvisioningService) {
  return {
    provision: (context: AuthContext, input: { businessName: string; ownerUserId: string; plan?: "STARTER" | "GROWTH" | "PRO" | "ENTERPRISE" }) => {
      if (context.userId !== input.ownerUserId) throw new Error("Only the authenticated owner can provision this workspace");
      return service.provision(input);
    },
  };
}

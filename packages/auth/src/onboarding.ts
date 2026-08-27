export type TenantPlan = "STARTER" | "GROWTH" | "PRO" | "ENTERPRISE";

export type OnboardBusinessInput = {
  businessName: string;
  ownerUserId: string;
  plan?: TenantPlan;
};

export type OnboardBusinessResult = {
  tenantId: string;
  ownerUserId: string;
  plan: TenantPlan;
};

export interface TenantOnboardingService {
  onboard(input: OnboardBusinessInput): Promise<OnboardBusinessResult>;
}

export function validateOnboardingInput(input: OnboardBusinessInput) {
  if (!input.businessName.trim()) throw new Error("Business name is required");
  if (!input.ownerUserId.trim()) throw new Error("Owner user ID is required");
  return { ...input, businessName: input.businessName.trim(), plan: input.plan ?? "STARTER" as TenantPlan };
}

export type ToolRisk = "low" | "medium" | "high";

export type ToolSafetyPolicy = {
  risk: ToolRisk;
  requiresApproval: boolean;
  allowedRoles?: readonly string[];
};

export type ToolExecutionContext = {
  tenantId: string;
  actorId?: string;
  roles?: readonly string[];
};

export function canExecute(
  policy: ToolSafetyPolicy,
  context: ToolExecutionContext,
): { allowed: boolean; reason?: string } {
  if (policy.allowedRoles?.length) {
    const roles = new Set(context.roles ?? []);
    if (!policy.allowedRoles.some((role) => roles.has(role))) {
      return { allowed: false, reason: "role_not_allowed" };
    }
  }

  if (policy.requiresApproval) {
    return { allowed: false, reason: "approval_required" };
  }

  return { allowed: true };
}

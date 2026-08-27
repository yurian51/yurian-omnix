export type WorkspaceBootstrap = {
  tenantId: string;
  ownerUserId: string;
  teamId: string;
  plan: "STARTER" | "GROWTH" | "PRO" | "ENTERPRISE";
};

export class SaaSWorkspaceService {
  async bootstrap(input: WorkspaceBootstrap) {
    if (!input.tenantId || !input.ownerUserId || !input.teamId) throw new Error("Incomplete workspace bootstrap");
    return { ready: true, ...input };
  }
}

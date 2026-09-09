import type { ApprovalRequest } from "./approval";

export interface ApprovalStore {
  create(request: ApprovalRequest): Promise<void>;
  get(id: string, tenantId: string): Promise<ApprovalRequest | undefined>;
  decide(id: string, tenantId: string, status: "approved" | "rejected", actorId: string): Promise<ApprovalRequest>;
}

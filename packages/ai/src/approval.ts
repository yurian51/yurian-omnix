export type ApprovalStatus = "pending" | "approved" | "rejected";

export type ApprovalRequest = {
  id: string;
  tenantId: string;
  tool: string;
  reason: string;
  status: ApprovalStatus;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
};

export function decideApproval(
  request: ApprovalRequest,
  decision: Exclude<ApprovalStatus, "pending">,
  actorId: string,
): ApprovalRequest {
  if (request.status !== "pending") {
    throw new Error("Approval request is already decided");
  }

  return {
    ...request,
    status: decision,
    decidedAt: new Date().toISOString(),
    decidedBy: actorId,
  };
}

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

export type PendingApproval = {
  id: string;
  tenantId: string;
  requesterUserId: string;
  command: string;
  args: Record<string, string>;
  status: ApprovalStatus;
  expiresAt: number;
};

export function isApprovalActive(approval: PendingApproval, now = Math.floor(Date.now() / 1000)) {
  return approval.status === "APPROVED" && approval.expiresAt > now;
}

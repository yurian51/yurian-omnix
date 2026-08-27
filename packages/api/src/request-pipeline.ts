import { randomUUID } from "node:crypto";
import type { RequestPrincipal } from "./tenant-context";
import { resolveTenantContext } from "./tenant-context";
import { requirePermission } from "./authorization";

export type ApiRequest = { requestId?: string; principal: RequestPrincipal; tenantId?: string; permission?: string };
export function prepareRequest(request: ApiRequest) {
  const requestId = request.requestId ?? randomUUID();
  const context = resolveTenantContext(request.principal, request.tenantId);
  if (request.permission) requirePermission(context.permissions, request.permission);
  return { requestId, ...context };
}

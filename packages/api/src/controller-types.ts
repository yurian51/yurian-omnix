import type { RequestPrincipal } from "./tenant-context";
import type { ApiError } from "./http-contracts";
export type ControllerContext = { requestId: string; principal: RequestPrincipal; tenantId: string };
export type ControllerResult<T> = { status: number; body: { data: T; requestId: string } } | { status: number; body: { error: ApiError } };

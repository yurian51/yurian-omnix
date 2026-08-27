import type { ControllerContext, ControllerResult } from "./controller-types";
import type { RequestPrincipal } from "./tenant-context";
import { prepareRequest } from "./request-pipeline";
import { mapApiError } from "./error-mapper";

export type RawHttpRequest = { requestId?: string; tenantId?: string; principal: RequestPrincipal; body?: unknown; params?: Record<string,string>; query?: Record<string,string> };
export async function invokeController<T>(request:RawHttpRequest, permission:string|undefined, handler:(ctx:ControllerContext,request:RawHttpRequest)=>Promise<ControllerResult<T>>) {
  const requestId=request.requestId ?? crypto.randomUUID();
  try { const prepared=prepareRequest({...request,permission}); return await handler({requestId:prepared.requestId,principal:request.principal,tenantId:prepared.tenantId},request); }
  catch(error) { const e=mapApiError(error,requestId); return {status:e.code==="FORBIDDEN"?403:e.code==="VALIDATION_ERROR"?400:500,body:{error:e}} as ControllerResult<T>; }
}

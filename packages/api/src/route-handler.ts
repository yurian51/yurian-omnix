import type { ControllerContext, ControllerResult } from "./controller-types";
import type { RawHttpRequest } from "./http-adapter";
import type { RouteDefinition } from "./router";
import type { RequestPrincipal } from "./tenant-context";

export type ControllerRegistry = Record<string,(ctx:ControllerContext,request:RawHttpRequest)=>Promise<ControllerResult<unknown>>>;
export function createRouteHandler(routes:readonly RouteDefinition[],controllers:ControllerRegistry){return async(method:string,path:string,request:RawHttpRequest)=>{const route=routes.find(r=>r.method===method&&r.path===path);if(!route) return {status:404,body:{error:{code:"NOT_FOUND",message:"Route not found",requestId:request.requestId??crypto.randomUUID()}}};const controller=controllers[route.handler];if(!controller) return {status:500,body:{error:{code:"INTERNAL_ERROR",message:"Route handler not configured",requestId:request.requestId??crypto.randomUUID()}}};const principal:RequestPrincipal=request.principal;return controller({requestId:request.requestId??crypto.randomUUID(),principal,tenantId:principal.tenantId},request);};}

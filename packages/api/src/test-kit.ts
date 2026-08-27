import type { RequestPrincipal } from "./tenant-context";
export const testPrincipal=(overrides:Partial<RequestPrincipal>={}):RequestPrincipal=>({userId:"test-user",tenantId:"test-tenant",roles:["admin"],permissions:["*"],...overrides});
export const testRequest=(overrides:Record<string,unknown>={})=>({requestId:"test-request",principal:testPrincipal(),tenantId:"test-tenant",body:undefined,params:{},query:{},...overrides});

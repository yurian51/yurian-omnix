import type { RequestPrincipal } from "../tenant-context";
export const testPrincipal=(overrides:Partial<RequestPrincipal>={})=>({userId:"test-user",tenantId:"test-tenant",roles:["admin"],permissions:["*"] ,...overrides});
export const testRequest=(overrides:Record<string,unknown>={})=>({method:"GET",path:"/health",principal:testPrincipal(),params:{},query:{},body:undefined,...overrides});

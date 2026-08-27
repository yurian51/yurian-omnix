export type RateLimitDecision={allowed:boolean;remaining:number;resetAt:number};
export interface RateLimiter{check(key:string,limit:number,windowMs:number):Promise<RateLimitDecision>;}
export function rateLimitKey(tenantId:string,userId:string,route:string){return `${tenantId}:${userId}:${route}`;}

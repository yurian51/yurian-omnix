export interface IdempotencyStore<T=unknown>{get(tenantId:string,key:string):Promise<T|null>;put(tenantId:string,key:string,value:T,ttlMs:number):Promise<void>;}
export function requireIdempotencyKey(value:string|undefined){if(!value?.trim())throw new Error("Idempotency-Key is required");if(value.length>255)throw new Error("Idempotency-Key is too long");return value.trim();}

export type RequestLog = { requestId:string; method:string; path:string; tenantId?:string; userId?:string; status:number; durationMs:number };
export function createRequestLog(input:RequestLog):RequestLog{return {...input,durationMs:Math.max(0,Math.round(input.durationMs))};}

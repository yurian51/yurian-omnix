export type CorsPolicy={origins:readonly string[];methods:readonly string[];headers:readonly string[]};
export const defaultCorsPolicy:CorsPolicy={origins:(process.env.CORS_ORIGINS??"").split(",").map(x=>x.trim()).filter(Boolean),methods:["GET","POST","PATCH","DELETE","OPTIONS"],headers:["Authorization","Content-Type","X-Request-ID"]};
export function isOriginAllowed(origin:string|undefined,policy: CorsPolicy=defaultCorsPolicy){return !!origin && (policy.origins.includes("*")||policy.origins.includes(origin));}

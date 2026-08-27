import type { IncomingHttpHeaders } from "node:http";
import { AuthenticationError } from "./auth-errors";
import { resolveBearerPrincipal, type TokenVerifier } from "./auth";
export async function authenticateHeaders(headers:IncomingHttpHeaders,verify:TokenVerifier){try{return await resolveBearerPrincipal(typeof headers.authorization==='string'?headers.authorization:undefined,verify);}catch(error){if(error instanceof Error)throw new AuthenticationError(error.message);throw new AuthenticationError();}}

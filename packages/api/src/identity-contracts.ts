export type AuthProvider={authenticate(input:{identifier:string;secret:string}):Promise<{userId:string;tenantId:string;roles:string[]}>};
export type Session={id:string;userId:string;tenantId:string;createdAt:string;expiresAt:string;revokedAt?:string};
export type Permission={resource:string;action:string};
export type AuthorizationDecision={allowed:boolean;reason:string};
export function permissionKey(permission:Permission){return `${permission.resource}:${permission.action}`;}

export type SessionPolicy={ttlSeconds:number;refreshRotation:boolean;revokeOnLogout:boolean};
export const defaultSessionPolicy:SessionPolicy={ttlSeconds:60*60*24*7,refreshRotation:true,revokeOnLogout:true};
export function isSessionActive(session:{expiresAt:string;revokedAt?:string},now=new Date()){return !session.revokedAt&&new Date(session.expiresAt).getTime()>now.getTime();}
export function hasPermission(grants:string[],required:string){return grants.includes("*")||grants.includes(required);}

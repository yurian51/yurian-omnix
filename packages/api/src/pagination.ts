export type PageRequest={cursor?:string;limit?:number};
export type Page<T>={items:T;nextCursor?:string};
export function normalizePageLimit(limit:number|undefined,max=100){if(limit===undefined)return Math.min(25,max);if(!Number.isInteger(limit)||limit<1)throw new Error("Invalid page limit");return Math.min(limit,max);}

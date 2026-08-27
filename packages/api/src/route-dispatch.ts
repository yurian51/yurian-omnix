import { routes } from "./router";
import { matchRoute } from "./route-matcher";
export type DispatchResult = { route: typeof routes[number]; params: Record<string,string> } | null;
export function dispatch(method:string,path:string):DispatchResult { for(const route of routes){ if(route.method!==method) continue; const params=matchRoute(route.path,path); if(params) return {route,params}; } return null; }

import { routes } from "./router";
export function findRoute(method:string,path:string){return routes.find(r=>r.method===method && new RegExp("^"+r.path.replace(/:[^/]+/g,"[^/]+")+"$").test(path)) ?? null;}

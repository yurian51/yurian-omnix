import type { RouteDefinition } from "./router";
export function matchRoute(method: string, pathname: string, definitions: readonly RouteDefinition[]) {
  for (const route of definitions) {
    if (route.method !== method) continue;
    const a = route.path.split("/").filter(Boolean); const b = pathname.split("/").filter(Boolean);
    if (a.length !== b.length) continue;
    const params: Record<string,string> = {}; let ok = true;
    a.forEach((part,i) => part.startsWith(":") ? params[part.slice(1)] = decodeURIComponent(b[i]) : part !== b[i] ? ok = false : undefined);
    if (ok) return { route, params };
  }
  return null;
}

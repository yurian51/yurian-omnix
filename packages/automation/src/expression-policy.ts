import type { VariableDefinition } from "./variable-catalog";
import { variableCatalog } from "./variable-catalog";

const allowed = new Set(variableCatalog.map((item) => item.path));
const TOKEN = /{{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*}}/g;

export function validateExpressions(value: unknown, catalog: VariableDefinition[] = variableCatalog): void {
  const paths = new Set(catalog.map((item) => item.path));
  const check = (input: unknown) => {
    if (typeof input === "string") {
      for (const match of input.matchAll(TOKEN)) if (!paths.has(match[1])) throw new Error(`Expression variable is not allowed: ${match[1]}`);
      return;
    }
    if (Array.isArray(input)) return input.forEach(check);
    if (input && typeof input === "object") return Object.values(input).forEach(check);
  };
  check(value);
}

export function isVariableAllowed(path: string) { return allowed.has(path); }

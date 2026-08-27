const TOKEN = /{{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*}}/g;

function resolve(root: unknown, path: string): unknown {
  return path.split(".").reduce((value: any, key) => value == null ? undefined : value[key], root as any);
}

export function resolveExpression(expression: string, context: Record<string, unknown>): unknown {
  const exact = expression.match(/^\s*{{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*}}\s*$/);
  if (exact) return resolve(context, exact[1]);
  return expression.replace(TOKEN, (_, path: string) => {
    const value = resolve(context, path);
    return value === undefined || value === null ? "" : String(value);
  });
}

export function interpolate(value: unknown, context: Record<string, unknown>): unknown {
  if (typeof value === "string") return resolveExpression(value, context);
  if (Array.isArray(value)) return value.map((item) => interpolate(item, context));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, interpolate(item, context)]));
  return value;
}

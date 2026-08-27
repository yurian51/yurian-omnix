import type { AutomationCondition } from "./types";

function getValue(input: unknown, path: string): unknown {
  return path.split(".").reduce((value: any, key) => value == null ? undefined : value[key], input as any);
}

export function evaluateConditions(conditions: AutomationCondition[] = [], input: unknown): boolean {
  return conditions.every((condition) => {
    const actual = getValue(input, condition.field);
    switch (condition.operator) {
      case "EQ": return actual === condition.value;
      case "NEQ": return actual !== condition.value;
      case "CONTAINS": return typeof actual === "string" && actual.includes(String(condition.value ?? ""));
      case "GT": return Number(actual) > Number(condition.value);
      case "GTE": return Number(actual) >= Number(condition.value);
      case "LT": return Number(actual) < Number(condition.value);
      case "LTE": return Number(actual) <= Number(condition.value);
      case "EXISTS": return actual !== undefined && actual !== null;
    }
  });
}

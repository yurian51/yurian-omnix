export function requireString(value: unknown, field: string) { if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`); return value.trim(); }
export function requirePositiveInteger(value: unknown, field: string) { if (!Number.isInteger(value) || Number(value) <= 0) throw new Error(`${field} must be a positive integer`); return Number(value); }
export function requireItems(value: unknown) { if (!Array.isArray(value) || value.length === 0) throw new Error("items must contain at least one item"); return value; }

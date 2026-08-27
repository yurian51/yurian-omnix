export function assertTenantId(tenantId: string) { if (!tenantId.trim()) throw new Error("tenantId is required"); return tenantId; }
export function scopedWhere(tenantId: string, column = "tenant_id") { assertTenantId(tenantId); return { sql: `${column} = $1`, params: [tenantId] }; }
export function limitValue(value = 50, max = 200) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < 1) return 1; return Math.min(parsed, max); }

import type { PoolClient } from "pg";
export async function setTenantScope(client:PoolClient,tenantId:string){if(!tenantId.trim())throw new Error("Tenant ID is required");await client.query("SELECT set_config($1,$2,true)",["app.tenant_id",tenantId]);}

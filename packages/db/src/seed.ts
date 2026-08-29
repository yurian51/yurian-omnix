import type { Pool } from "pg";
export async function seedDevelopment(pool:Pool){if(process.env.NODE_ENV==="production")throw new Error("Development seed is disabled in production");await pool.query("INSERT INTO tenants(name) SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM tenants WHERE name=$1)",["OMNIX Development"]);}

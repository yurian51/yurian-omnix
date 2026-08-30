import type { Pool } from "pg";
export function createTenantRepository(pool:Pool){return {async get(id:string){const r=await pool.query("SELECT id,name,created_at FROM tenants WHERE id=$1",[id]);return r.rows[0]??null;},async create(name:string){const r=await pool.query("INSERT INTO tenants(name) VALUES($1) RETURNING id,name,created_at",[name]);return r.rows[0];}};}

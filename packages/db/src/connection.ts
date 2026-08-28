import { Pool, type PoolConfig } from "pg";
export function createDbPool(config:PoolConfig={}){return new Pool({connectionString:process.env.DATABASE_URL,...config,max:Number(process.env.DB_POOL_MAX??10)});}

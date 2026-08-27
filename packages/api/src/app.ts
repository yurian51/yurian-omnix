import type { Pool } from "pg";
import { createCompleteRepositories } from "../../persistence/src/repository-implementations";
import { createControllers } from "./controllers";
import { health } from "./health";

export function createApiApp(pool: Pool) { const repositories=createCompleteRepositories(pool); const controllers=createControllers({ customers:repositories.customers as any, products:repositories.products as any, orders:repositories.orders as any, payments:repositories.payments as any, tickets:repositories.tickets as any }); return { health, controllers, repositories }; }

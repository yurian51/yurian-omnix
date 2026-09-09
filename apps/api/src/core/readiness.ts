import { validateDatabaseUrl } from "@omnix/database";
import { validateRedisUrl } from "@omnix/queue";

export function getReadiness(env: NodeJS.ProcessEnv = process.env) {
  const database = validateDatabaseUrl(env.DATABASE_URL);
  const redis = validateRedisUrl(env.REDIS_URL);
  return {
    ok: database.configured && redis.configured,
    checks: {
      database: { configured: database.configured },
      redis: { configured: redis.configured },
    },
  };
}

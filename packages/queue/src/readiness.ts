export type RedisReadiness = {
  configured: boolean;
  valid: boolean;
  reason?: string;
};

export function validateRedisUrl(value: string | undefined): RedisReadiness {
  if (!value?.trim()) return { configured: false, valid: false, reason: "REDIS_URL is not configured" };
  try {
    const url = new URL(value);
    if (!["redis:", "rediss:"].includes(url.protocol)) {
      return { configured: false, valid: false, reason: "REDIS_URL must use Redis" };
    }
    return { configured: true, valid: true };
  } catch {
    return { configured: false, valid: false, reason: "REDIS_URL is invalid" };
  }
}

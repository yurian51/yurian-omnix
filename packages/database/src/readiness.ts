export type DatabaseReadiness = {
  configured: boolean;
  reachable: boolean;
  reason?: string;
};

export function validateDatabaseUrl(value: string | undefined): DatabaseReadiness {
  if (!value?.trim()) return { configured: false, reachable: false, reason: "DATABASE_URL is not configured" };
  try {
    const url = new URL(value);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) {
      return { configured: false, reachable: false, reason: "DATABASE_URL must use PostgreSQL" };
    }
    return { configured: true, reachable: false };
  } catch {
    return { configured: false, reachable: false, reason: "DATABASE_URL is invalid" };
  }
}

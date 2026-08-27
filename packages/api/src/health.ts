export type HealthStatus = { status: "ok"; service: "omnix-api"; version: string; timestamp: string };
export function health(version = process.env.APP_VERSION ?? "0.0.0"): HealthStatus { return { status:"ok", service:"omnix-api", version, timestamp:new Date().toISOString() }; }

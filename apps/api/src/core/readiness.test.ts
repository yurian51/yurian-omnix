import { strict as assert } from "node:assert";
import test from "node:test";
import { getReadiness } from "./readiness";

test("readiness fails when database or redis is missing", () => {
  const result = getReadiness({});
  assert.equal(result.ok, false);
});

test("readiness passes configuration checks", () => {
  const result = getReadiness({
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    REDIS_URL: "redis://localhost:6379",
  });
  assert.equal(result.ok, true);
});

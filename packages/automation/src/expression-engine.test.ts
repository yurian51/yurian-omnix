import assert from "node:assert/strict";
import test from "node:test";
import { interpolate, resolveExpression } from "./expression-engine";

test("resolves nested expressions", () => {
  const context = { customer: { name: "Yurian", phone: "+255700000000" } };
  assert.equal(resolveExpression("{{customer.name}}", context), "Yurian");
  assert.equal(resolveExpression("Hello {{customer.name}}", context), "Hello Yurian");
});

test("interpolates nested objects and arrays", () => {
  const result = interpolate({ to: "{{customer.phone}}", items: ["{{order.id}}"] }, { customer: { phone: "123" }, order: { id: "O-1" } });
  assert.deepEqual(result, { to: "123", items: ["O-1"] });
});

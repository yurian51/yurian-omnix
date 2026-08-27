import assert from "node:assert/strict";
import test from "node:test";
import { CommandParser } from "./parser";
import { CommandRegistry } from "./registry";
import { CommandExecutor } from "./executor";
import { createGroupCommands } from "./group.commands";

const groupService = { execute: async (action: string, _context: unknown, args: Record<string, unknown>) => ({ action, args }) } as any;
const registry = new CommandRegistry();
for (const command of createGroupCommands(groupService)) registry.register(command);

test("parses group create with quoted name", () => {
  const parsed = new CommandParser(registry.list()).parse('/group create "Altavox Developers"');
  assert.deepEqual(parsed?.args, { name: "Altavox Developers" });
  assert.equal(parsed?.name, "group.create");
});

test("requires approval for destructive group deletion", async () => {
  const parsed = new CommandParser(registry.list()).parse("/group delete GROUP-1");
  assert.ok(parsed);
  const result = await new CommandExecutor(registry).execute(parsed, {
    tenantId: "tenant-1", userId: "owner-1", role: "OWNER", permissions: ["whatsapp.groups.delete"], channel: "WHATSAPP"
  });
  assert.equal(result.status, "AWAITING_APPROVAL");
});

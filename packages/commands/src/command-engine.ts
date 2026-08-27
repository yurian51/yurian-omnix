import type { Permission, Role } from "@omnix/auth";
import { assertPermission } from "@omnix/auth";
import { CommandParser } from "./parser";
import { CommandRegistry } from "./registry";
import { assertCommandCapability, type CapabilityResolver } from "./capability";
import type { CommandContext } from "./types";

export class CommandEngine {
  private readonly parser: CommandParser;
  constructor(private readonly registry: CommandRegistry, private readonly resolveCapabilities?: CapabilityResolver) {
    this.parser = new CommandParser(registry.list());
  }

  async handle(input: string, context: CommandContext & { role: Role; permissions: readonly Permission[]; phoneNumberId?: string }, approval?: { approved: boolean }) {
    const parsed = this.parser.parse(input);
    if (!parsed) return { handled: false as const };
    const command = this.registry.get(parsed.name);
    if (!command) throw new Error("Unknown command");
    if (command.permission) assertPermission({ userId: context.userId, tenantId: context.tenantId, role: context.role, permissions: context.permissions }, command.permission);
    if (this.resolveCapabilities && context.phoneNumberId) await assertCommandCapability(command, context.tenantId, context.phoneNumberId, this.resolveCapabilities);
    if (command.requiresApproval && !approval?.approved) return { handled: true as const, status: "AWAITING_APPROVAL" as const, command: command.name, args: parsed.args };
    return { handled: true as const, status: "EXECUTED" as const, result: await command.execute(parsed.args, context) };
  }
}

import type { Permission } from "@omnix/auth";
import { assertPermission } from "@omnix/auth";
import type { CommandContext, CommandDefinition, ParsedCommand } from "./types";
import { CommandRegistry } from "./registry";

export type CommandApproval = { approved: boolean };

export class CommandExecutor {
  constructor(private readonly registry: CommandRegistry) {}

  async execute(parsed: ParsedCommand, context: CommandContext, approval?: CommandApproval) {
    const command = this.registry.get(parsed.name);
    if (!command) throw new Error("Unknown command");
    if (command.permission) assertPermission(context as any, command.permission as Permission);
    if (command.requiresApproval && !approval?.approved) return { status: "AWAITING_APPROVAL" as const, command: command.name };
    return { status: "EXECUTED" as const, result: await command.execute(parsed.args, context) };
  }
}

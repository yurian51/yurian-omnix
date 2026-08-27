import type { CommandDefinition } from "./types";

export class CommandRegistry {
  private readonly commands = new Map<string, CommandDefinition>();

  register(command: CommandDefinition) {
    if (this.commands.has(command.name)) throw new Error(`Command already registered: ${command.name}`);
    this.commands.set(command.name, command);
  }

  get(name: string) { return this.commands.get(name); }
  list() { return [...this.commands.values()]; }
}

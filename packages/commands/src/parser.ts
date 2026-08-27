import type { CommandDefinition, ParsedCommand } from "./types";

export class CommandParser {
  constructor(private readonly definitions: readonly CommandDefinition[]) {}

  parse(input: string): ParsedCommand | null {
    const raw = input.trim();
    if (!raw.startsWith("/")) return null;
    const tokens = raw.slice(1).match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
    if (!tokens.length) return null;
    const candidates = [tokens.slice(0, 2).join(" ").toLowerCase(), tokens[0].toLowerCase()];
    const definition = this.definitions.find((item) => item.aliases.some((alias) => candidates.includes(alias.replace(/^\//, "").toLowerCase())) || item.name.toLowerCase() === candidates[0]);
    if (!definition) return null;
    const values = tokens.slice(definition.name.includes(".") ? 1 : 1).map((v) => v.replace(/^"|"$/g, ""));
    const args: Record<string, string> = {};
    definition.args?.forEach((arg, index) => { if (values[index] !== undefined) args[arg.name] = values[index]; });
    return { name: definition.name, args, raw };
  }
}

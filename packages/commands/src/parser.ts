import type { CommandDefinition, ParsedCommand } from "./types";

export class CommandParser {
  constructor(private readonly definitions: readonly CommandDefinition[]) {}

  parse(input: string): ParsedCommand | null {
    const raw = input.trim();
    if (!raw.startsWith("/")) return null;
    const tokens = raw.slice(1).match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
    if (!tokens.length) return null;
    const normalized = tokens.map((token) => token.replace(/^"|"$/g, ""));
    const matches = this.definitions.flatMap((definition) => definition.aliases.map((alias) => ({ definition, alias })));
    const match = matches.filter(({ alias }) => {
      const aliasTokens = alias.replace(/^\//, "").trim().split(/\s+/);
      return aliasTokens.every((value, index) => normalized[index]?.toLowerCase() === value.toLowerCase());
    }).sort((a, b) => b.alias.length - a.alias.length)[0];
    if (!match) return null;
    const consumed = match.alias.replace(/^\//, "").trim().split(/\s+/).length;
    const values = normalized.slice(consumed);
    const args: Record<string, string> = {};
    match.definition.args?.forEach((arg, index) => { if (values[index] !== undefined) args[arg.name] = values[index]; });
    return { name: match.definition.name, args, raw };
  }
}

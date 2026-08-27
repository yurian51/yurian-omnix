export type CommandCategory = "CUSTOMER" | "BUSINESS" | "AGENT" | "GROUP" | "SYSTEM";
export type CommandArgumentType = "string" | "number" | "boolean";
export type CommandArgument = { name: string; type: CommandArgumentType; required?: boolean };
export type CommandContext = { tenantId: string; userId: string; role: string; channel: "WHATSAPP" | "API" };
export type CommandDefinition = { name: string; aliases: string[]; description: string; category: CommandCategory; permission?: string; requiresApproval?: boolean; destructive?: boolean; args?: CommandArgument[]; execute: (args: Record<string, unknown>, context: CommandContext) => Promise<unknown> };
export type ParsedCommand = { name: string; args: Record<string, string>; raw: string };

export type NodeFieldType = "TEXT" | "TEXTAREA" | "NUMBER" | "BOOLEAN" | "SELECT" | "JSON" | "EXPRESSION";
export type NodeConfigField = { key: string; label: string; type: NodeFieldType; required?: boolean; secret?: boolean; options?: { label: string; value: string }[]; placeholder?: string };

export const nodeConfigSchemas: Record<string, NodeConfigField[]> = {
  TRIGGER: [{ key: "type", label: "Trigger type", type: "SELECT", required: true, options: [{ label: "Event", value: "EVENT" }, { label: "Command", value: "COMMAND" }, { label: "Schedule", value: "SCHEDULE" }, { label: "Webhook", value: "WEBHOOK" }] }],
  CONDITION: [{ key: "field", label: "Field", type: "EXPRESSION", required: true }, { key: "operator", label: "Operator", type: "SELECT", required: true, options: [{ label: "Equals", value: "EQ" }, { label: "Not equals", value: "NEQ" }, { label: "Contains", value: "CONTAINS" }, { label: "Greater than", value: "GT" }, { label: "Greater or equal", value: "GTE" }, { label: "Less than", value: "LT" }, { label: "Less or equal", value: "LTE" }, { label: "Exists", value: "EXISTS" }] }, { key: "value", label: "Value", type: "EXPRESSION" }],
  AI: [{ key: "agent", label: "Agent", type: "TEXT", required: true }, { key: "instruction", label: "Instruction", type: "TEXTAREA", required: true }, { key: "model", label: "Model", type: "TEXT" }],
  COMMAND: [{ key: "command", label: "Command", type: "TEXT", required: true }, { key: "args", label: "Arguments", type: "JSON" }],
  WHATSAPP: [{ key: "action", label: "Action", type: "SELECT", required: true, options: [{ label: "Send message", value: "SEND" }, { label: "Send media", value: "MEDIA" }] }, { key: "to", label: "Recipient", type: "EXPRESSION", required: true }, { key: "message", label: "Message", type: "TEXTAREA", required: true }],
  WAIT: [{ key: "ms", label: "Delay (milliseconds)", type: "NUMBER", required: true }],
  HTTP: [{ key: "method", label: "Method", type: "SELECT", required: true, options: [{ label: "GET", value: "GET" }, { label: "POST", value: "POST" }, { label: "PUT", value: "PUT" }, { label: "DELETE", value: "DELETE" }] }, { key: "url", label: "URL", type: "TEXT", required: true }, { key: "headers", label: "Headers", type: "JSON" }, { key: "body", label: "Body", type: "JSON" }],
  TICKET: [{ key: "title", label: "Title", type: "TEXT", required: true }, { key: "priority", label: "Priority", type: "SELECT", options: [{ label: "Low", value: "LOW" }, { label: "Normal", value: "NORMAL" }, { label: "High", value: "HIGH" }, { label: "Urgent", value: "URGENT" }] }],
  ORDER: [{ key: "customerId", label: "Customer", type: "EXPRESSION", required: true }, { key: "items", label: "Items", type: "JSON", required: true }],
  TAG: [{ key: "tag", label: "Tag", type: "TEXT", required: true }],
  ASSIGN_AGENT: [{ key: "agentId", label: "Agent", type: "EXPRESSION", required: true }],
  END: [],
};

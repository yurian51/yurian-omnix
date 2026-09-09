export class ToolExecutionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = "ToolExecutionError";
  }
}

export class ToolAuthorizationError extends ToolExecutionError {
  constructor(message = "Tool execution is not authorized") {
    super(message, "TOOL_NOT_AUTHORIZED", false);
    this.name = "ToolAuthorizationError";
  }
}

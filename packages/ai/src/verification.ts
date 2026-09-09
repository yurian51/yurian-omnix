export type VerificationResult =
  | { verified: true; summary?: string }
  | { verified: false; reason: string };

export function verifyToolOutput(output: unknown): VerificationResult {
  if (output === undefined) {
    return { verified: false, reason: "tool_returned_undefined" };
  }

  if (output && typeof output === "object" && "error" in output) {
    return { verified: false, reason: "tool_reported_error" };
  }

  return { verified: true };
}

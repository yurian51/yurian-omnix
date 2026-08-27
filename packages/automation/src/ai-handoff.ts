export type HandoffDecision = { handoff: boolean; reason: string };

export function evaluateHandoff(confidence: number, threshold = 0.7): HandoffDecision {
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error("AI confidence must be between 0 and 1");
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) throw new Error("Handoff threshold must be between 0 and 1");
  return confidence < threshold
    ? { handoff: true, reason: "AI confidence is below the configured human-handoff threshold" }
    : { handoff: false, reason: "AI confidence meets the configured threshold" };
}

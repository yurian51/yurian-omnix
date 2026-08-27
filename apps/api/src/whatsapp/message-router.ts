import type { OmnixInboundMessage } from "./events";

export type MessageRoute = "AI" | "HUMAN" | "HYBRID";

export type MessageRoutingContext = {
  conversationMode: MessageRoute;
  aiEnabled: boolean;
};

export function routeInboundMessage(
  message: OmnixInboundMessage,
  context: MessageRoutingContext,
): { route: MessageRoute; message: OmnixInboundMessage } {
  if (context.conversationMode === "HUMAN") {
    return { route: "HUMAN", message };
  }

  if (context.conversationMode === "HYBRID") {
    return { route: "HYBRID", message };
  }

  return { route: context.aiEnabled ? "AI" : "HUMAN", message };
}

export interface InboundEventStore { has(providerMessageId: string): Promise<boolean>; markProcessed(providerMessageId: string): Promise<void>; }

export async function processOnce(providerMessageId: string, store: InboundEventStore, handler: () => Promise<void>) {
  if (await store.has(providerMessageId)) return { processed: false } as const;
  await handler();
  await store.markProcessed(providerMessageId);
  return { processed: true } as const;
}

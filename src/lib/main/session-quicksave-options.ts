import { z } from "zod";

export const SessionQuicksaveOptions = z.object({
  isFirstStart: z.boolean().default(true),
  // if the store object was parsed by this zod schema, it is considered initialized
  // the initial value of the solid-store is "false" for this prop
  isInitialized: z.boolean().default(true),
  sessionsFolderId: z.string().optional(),
  openBookmarkTreeNodes: z.array(z.string()).default([]),
});
export type SessionQuicksaveOptionsIn = z.input<typeof SessionQuicksaveOptions>;
export type SessionQuicksaveOptions = z.output<typeof SessionQuicksaveOptions>;

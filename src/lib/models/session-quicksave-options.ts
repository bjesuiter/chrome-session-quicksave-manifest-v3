import { z } from "zod";

export const SessionQuicksaveOptions = z.object({
  sessionsFolderId: z.string().optional(),
});
export type SessionQuicksaveOptions = z.infer<typeof SessionQuicksaveOptions>;

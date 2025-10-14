import { z } from "zod";

export const createVouchSchema = z.object({
  skill: z.string().max(50).optional(),
  message: z.string().max(300).optional(),
});

export type CreateVouchInput = z.infer<typeof createVouchSchema>;



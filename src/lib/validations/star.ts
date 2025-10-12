import { z } from "zod";

export const createStarSchema = z.object({
  profileId: z.string().cuid("Invalid profile ID"),
  ipHash: z.string().min(1, "IP hash is required"),
  userAgent: z.string().optional(),
});

export const getStarByIdSchema = z.object({
  id: z.string().cuid("Invalid star ID"),
});

export const getStarsByProfileSchema = z.object({
  profileId: z.string().cuid("Invalid profile ID"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const getStarsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type CreateStarInput = z.infer<typeof createStarSchema>;
export type GetStarByIdInput = z.infer<typeof getStarByIdSchema>;
export type GetStarsByProfileInput = z.infer<typeof getStarsByProfileSchema>;
export type GetStarsQueryInput = z.infer<typeof getStarsQuerySchema>;

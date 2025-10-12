import { z } from "zod";

export const createRepoSchema = z.object({
  profileId: z.string().cuid("Invalid profile ID"),
  name: z.string().min(1, "Repository name is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid repository URL"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  stars: z.number().int().min(0, "Stars must be non-negative"),
  fork: z.boolean().default(false),
});

export const updateRepoSchema = z.object({
  name: z.string().min(1, "Repository name is required").optional(),
  description: z.string().optional(),
  url: z.string().url("Invalid repository URL").optional(),
  languages: z.array(z.string()).optional(),
  stars: z.number().int().min(0, "Stars must be non-negative").optional(),
  fork: z.boolean().optional(),
});

export const getRepoByIdSchema = z.object({
  id: z.string().cuid("Invalid repository ID"),
});

export const getReposByProfileSchema = z.object({
  profileId: z.string().cuid("Invalid profile ID"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const getReposQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().default(""),
  language: z.string().optional(),
  minStars: z.coerce.number().optional(),
});

export type CreateRepoInput = z.infer<typeof createRepoSchema>;
export type UpdateRepoInput = z.infer<typeof updateRepoSchema>;
export type GetRepoByIdInput = z.infer<typeof getRepoByIdSchema>;
export type GetReposByProfileInput = z.infer<typeof getReposByProfileSchema>;
export type GetReposQueryInput = z.infer<typeof getReposQuerySchema>;

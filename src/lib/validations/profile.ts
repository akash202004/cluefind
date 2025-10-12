import { z } from "zod";

export const createProfileSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  skills: z.array(z.string()).default([]),
  resumeUrl: z.string().url("Invalid resume URL").optional(),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().url("Invalid resume URL").optional(),
});

export const getProfileByIdSchema = z.object({
  id: z.string().cuid("Invalid profile ID"),
});

export const getProfileByUserIdSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
});

export const getProfilesQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().default(""),
  skills: z.string().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type GetProfileByIdInput = z.infer<typeof getProfileByIdSchema>;
export type GetProfileByUserIdInput = z.infer<typeof getProfileByUserIdSchema>;
export type GetProfilesQueryInput = z.infer<typeof getProfilesQuerySchema>;

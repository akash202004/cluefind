import { z } from "zod";

export const createProfileSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  skills: z.array(z.string()).default([]),
  resumeUrl: z.string().url("Invalid resume URL").optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  url: z.string().url("Invalid project URL").optional(),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid social link URL"),
});

export const updateProfileSchema = z.object({
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().url("Invalid resume URL").optional(),
  resumeContent: z.string().optional(),
  githubId: z.string().optional(),
  projects: z.array(projectSchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
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

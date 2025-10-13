import { z } from "zod";

export const createUserSchema = z.object({
  googleId: z.string().min(1, "Google ID is required"),
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email"),
  image: z.string().url("Invalid image URL").optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const getUserByGoogleIdSchema = z.object({
  googleId: z.string().min(1, "Google ID is required"),
});

export const getUserByIdSchema = z.object({
  id: z.string().cuid("Invalid user ID format"),
});

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().default(""),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserByGoogleIdInput = z.infer<typeof getUserByGoogleIdSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;

import { NextRequest } from "next/server";
import { z } from "zod";
import { createError } from "@/lib/errors";

export const parseBody = async (request: NextRequest) => {
  try {
    return await request.json();
  } catch (error) {
    throw createError("Invalid JSON in request body", 400);
  }
};

export const validateRequest = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw createError(`Validation error: ${errorMessage}`, 400);
    }
    throw createError("Invalid request data", 400);
  }
};

export const validateParams = <T>(
  params: unknown,
  schema: z.ZodSchema<T>
): T => {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw createError(`Invalid parameters: ${errorMessage}`, 400);
    }
    throw createError("Invalid request parameters", 400);
  }
};

export const validateQuery = <T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T => {
  try {
    const queryObject = Object.fromEntries(searchParams.entries());
    return schema.parse(queryObject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw createError(`Invalid query parameters: ${errorMessage}`, 400);
    }
    throw createError("Invalid query parameters", 400);
  }
};

export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (real) {
    return real;
  }

  return "unknown";
};

export const getUserAgent = (request: NextRequest): string => {
  return request.headers.get("user-agent") || "unknown";
};

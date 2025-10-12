export { ApiError, createError, ERROR_MESSAGES } from "./api-error";

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle Prisma errors
    if (error.message.includes("Unique constraint")) {
      return createError("Resource already exists", 409);
    }

    if (error.message.includes("Record to update not found")) {
      return createError("Resource not found", 404);
    }

    if (error.message.includes("Record to delete not found")) {
      return createError("Resource not found", 404);
    }

    // Handle validation errors
    if (error.message.includes("Invalid")) {
      return createError(error.message, 400);
    }

    // Handle specific error messages
    if (error.message.includes("already exists")) {
      return createError(error.message, 409);
    }

    if (error.message.includes("not found")) {
      return createError(error.message, 404);
    }

    if (error.message.includes("already starred")) {
      return createError(error.message, 409);
    }

    return createError("Internal server error", 500);
  }

  return createError("Unknown error occurred", 500);
};

export const isOperationalError = (error: unknown): error is ApiError => {
  if (error instanceof ApiError) {
    return error.isOperational;
  }
  return false;
};

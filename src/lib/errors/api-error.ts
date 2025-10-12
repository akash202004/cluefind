export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (message: string, statusCode: number = 500) => {
  return new ApiError(message, statusCode);
};

// Common error messages
export const ERROR_MESSAGES = {
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  VALIDATION_ERROR: "Validation error",
  CONFLICT: "Resource conflict",
  INTERNAL_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
  TOO_MANY_REQUESTS: "Too many requests",
} as const;

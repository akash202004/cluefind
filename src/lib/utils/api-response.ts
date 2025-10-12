export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
});

export const createPaginatedResponse = <T>(
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string
): PaginatedResponse<T> => ({
  success: true,
  data,
  pagination,
  message,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (
  error: string,
  statusCode: number = 500
): ApiResponse => ({
  success: false,
  error,
  timestamp: new Date().toISOString(),
});

export const createValidationErrorResponse = (
  errors: string[]
): ApiResponse => ({
  success: false,
  error: `Validation failed: ${errors.join(", ")}`,
  timestamp: new Date().toISOString(),
});

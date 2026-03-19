export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode: number;
}

export function successResponse<T>(data: T, statusCode = 200): ApiResponse<T> {
  return {
    success: true,
    data,
    statusCode,
  };
}

export function errorResponse(message: string, statusCode = 500): ApiResponse {
  return {
    success: false,
    message,
    statusCode,
  };
}

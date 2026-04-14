export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

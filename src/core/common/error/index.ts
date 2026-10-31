import { isAxiosError } from 'axios';

export interface IErrorResponse {
  status: number;
  error: string;
  message: string;
}

export interface IErrorMessage {
  code: number;
  message: string;
}

export class AppError extends Error {
  public status: number;
  public code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const mapAxiosErrorToAppError = (error: unknown): AppError => {
  // use the named isAxiosError guard from axios to avoid lint complaints
  if (isAxiosError(error)) {
    const axiosError = error;
    const resp = axiosError.response;
    const data = resp?.data as any;

    // If the server returned a structured error (matches IErrorResponse), use it
    if (data?.statusCode && data?.message) {
      const status = resp?.status ?? 500;
      const code = data?.error ?? 'Unknown Error';
      const message = data.message || 'An error occurred';
      return new AppError(status, code, message);
    }

    // Otherwise create a generic AppError using status/message if available
    const status = resp?.status ?? 500;
    const message = axiosError.message || 'Network or server error';
    return new AppError(status, '', message);
  }

  // Non-axios errors
  const genericMessage = error instanceof Error ? error.message : 'Unknown error';
  return new AppError(500, '', genericMessage);
};

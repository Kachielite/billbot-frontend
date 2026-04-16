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
  public code: number;

  constructor(status: number, code: number, message: string) {
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
    if (data?.error?.code && data?.error?.message) {
      const status = resp?.status ?? 500;
      const code = Number(data.error.code) || 0;
      const message = String(data.error.message);
      return new AppError(status, code, message);
    }

    // Otherwise create a generic AppError using status/message if available
    const status = resp?.status ?? 500;
    const message = axiosError.message || 'Network or server error';
    return new AppError(status, 0, message);
  }

  // Non-axios errors
  const genericMessage = error instanceof Error ? error.message : 'Unknown error';
  return new AppError(500, 0, genericMessage);
};

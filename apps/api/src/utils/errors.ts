export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code = "APP_ERROR"
  ) {
    super(message);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}


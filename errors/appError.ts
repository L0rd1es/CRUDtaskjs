export enum AppErrorType {
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  FORBIDDEN = "FORBIDDEN",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export class AppError extends Error {
  constructor(
    public type: AppErrorType,
    public message: string,
    public status: number,
    public details: unknown[] = []
  ) {
    super(message);
    this.name = "AppError";
  }
}

type AppErrorType = "VALIDATION" | "NOT_FOUND" | "FORBIDDEN" | "UNAUTHORIZED";

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

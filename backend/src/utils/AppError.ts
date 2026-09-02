export class AppError extends Error {
  public readonly status: number;
  public readonly details?: string[];

  constructor(message: string, status = 400, details?: string[]) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

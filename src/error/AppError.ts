export class AppError extends Error {
  public statusCode: number;

  constructor(msg: string, statusCode: number) {
    super(msg); 
    this.statusCode = statusCode;
    this.name = 'appError';
    Error.captureStackTrace(this, this.constructor);
  }
}
